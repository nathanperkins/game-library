const connection = require('../db');
const compileSql = require('named-placeholders')();

const GameRelease = {};

// returns all game_releases as an array
// obj is not used here, but included for consistency
// with other models
GameRelease.getAll = (obj, callback) => {
    const sql = `
    SELECT GRelease.id, GRelease.release_date, GRelease.rating, GRelease.boxart_url,
    Title.name AS title, Title.id AS title_id, 
    Platform.name AS platform, Platform.id AS platform_id
    FROM game_releases AS GRelease
    JOIN game_titles AS Title
    ON Title.id = GRelease.title_id
    JOIN game_platforms AS Platform
    ON Platform.id = GRelease.platform_id
    ORDER BY id ASC
    ;`

    connection.query(sql, (err, rows, fields) => {
        callback(err, rows, fields);
    });
};

// returns one game_release by id    if object = {id} 
GameRelease.get = (obj, callback) => {
    if (!obj.hasOwnProperty('id')) {
        callback(new Error('GameRelease.get() error: need to provide {id}'));
        return;
    }
    
    const sql = `
    SELECT GRelease.id, GRelease.release_date, GRelease.rating, GRelease.boxart_url,
    Title.name AS title, Title.id AS title_id, 
    Platform.name AS platform, Platform.id AS platform_id
    FROM game_releases AS GRelease
    JOIN game_titles AS Title
    ON Title.id = GRelease.title_id
    JOIN game_platforms AS Platform
    ON Platform.id = GRelease.platform_id
    WHERE GRelease.id = :id
    ;`

    const compiledQuery = compileSql(sql, {id: obj.id});
    connection.query(compiledQuery[0], compiledQuery[1], (err, rows, fields) => {
        if (rows.length > 1) {
            callback(new Error('GameRelease.get() error: returned more than one row'));
        }
        else if (rows.length == 0) {
            callback(new Error(`GameRelease.get() error: did not find GameRelease with id: ${obj.id}`));
        }
        else {
            callback(err, rows[0], fields);
        }
    });
};

GameRelease.search = (obj, callback) => {
    let term = '%';
    if (obj.search_term) {
        term = `${term}${obj.search_term}%`
    }

    const sql = `
    SELECT GR.id as rid, GT.name AS title, GP.name AS platform,
      GR.boxart_url, GT.description
    FROM game_releases AS GR
    JOIN game_titles AS GT
      ON GT.id = GR.title_id
    JOIN game_platforms AS GP
      ON GP.id = GR.platform_id
    WHERE GT.name LIKE :term
     OR GP.name LIKE :term
    ORDER BY title, platform ASC
    ;`

    const compiledQuery = compileSql(sql, { term });
    connection.query(compiledQuery[0], compiledQuery[1], (err, rows, fields) => {
        if (err)
            callback(err);
        else 
            callback(null, rows, fields);
    });
};

const get_all_game_releases_with_search = 

// create a game_release from an object
// returns that game_release
GameRelease.create = (obj, callback) => {
    if ( !("title_id" in obj && "platform_id" in obj && "rating" in obj && "boxart_url" in obj && "release_date" in obj) ) {
        callback(new Error('GameRelease.create(): missing required parameters'));
        return;
    }

    const sql = `
    INSERT INTO game_releases
    (title_id, platform_id, rating, boxart_url, release_date)
    VALUES
    (:title_id, :platform_id, :rating, :boxart_url, :release_date)
    ;` 

    const compiledQuery = compileSql(sql, obj);

    connection.query(compiledQuery[0], compiledQuery[1], (err, result, fields) => {
        if (err) {
            callback(err);
            return;
        }

        GameRelease.get({id: result.insertId}, (err, release) => {
            callback(err, release, fields);
        });
    });
};

// destroys a game_release by id
// returns the sql result
GameRelease.destroy = (obj, callback) => {
    if (!obj.hasOwnProperty('id')) {
        callback(new Error('No id given for GameRelease.destroy()'));
        return;
    }

    const sql = `
        DELETE FROM game_releases
        WHERE game_releases.id = :id
        ;`;

    const compiledQuery = compileSql(sql, {id: obj.id});
    connection.query(compiledQuery[0], compiledQuery[1], (err, result) => {
        
        if (result.affectedRows === 0) {
            callback(new Error(`GameRelease.destroy() error: release with id: ${obj.id} not found.`));
            return;
        }

        callback(err, result);
    });
};

// update a game_release by id
// and return the game_release
GameRelease.update = (obj, callback) => {
    if (!obj.hasOwnProperty('id') ) {
        callback(new Error('GameRelease.update() error: no id given'));
        return;
    }

    const sql = `
        UPDATE game_releases
        SET title_id     = :title_id,
            platform_id  = :platform_id,
            rating       = :rating,
            boxart_url   = :boxart_url,
            release_date = :release_date
        WHERE id         = :id
        ;`;

    GameRelease.get({id: obj.id}, (err, release) => {
        if (err) {
            callback(err);
            return;
        }

        const compiledQuery = compileSql(sql, {
            title_id     : obj.title_id     || release.title_id,
            platform_id  : obj.platform_id  || release.platform_id,
            rating       : obj.rating       || release.rating,
            boxart_url   : obj.boxart_url   || release.boxart_url,
            release_date : obj.release_date || release.release_date,
            id           : obj.id,
        });

        connection.query(compiledQuery[0], compiledQuery[1], (err, result) => {
            if (err) {
                callback(err);
                return;
            }
            
            if (result.affectedRows === 0) {
                callback(new Error('GameRelease.update() error: row not changed'));
                return;
            }

            GameRelease.get({id: obj.id}, (err, release) => {
                callback(err, release);
            });
        });
    });
};

module.exports = GameRelease;

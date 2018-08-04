const connection = require('../db');
const compileSql = require('named-placeholders')();

const GameCopy = {};

// returns all game_copies as an array
// obj is not used here, but included for consistency
// with other models
GameCopy.getAll = (obj, callback) => {
    const sql = `
    SELECT Copy.id, Copy.status, Title.name AS title, Platform.name AS platform, 
    Copy.library_tag
    FROM game_copies AS Copy
    JOIN game_releases AS GRelease
    ON GRelease.id = Copy.release_id
    JOIN game_platforms AS Platform
    ON Platform.id = GRelease.platform_id
    JOIN game_titles AS Title
    ON Title.id = GRelease.title_id
    ORDER BY id ASC
    ;`;

    connection.query(sql, (err, rows, fields) => {
        callback(err, rows, fields);
    });
};

// returns one game_copy by id    if object = {id} 
GameCopy.get = (obj, callback) => {
    if (!obj.hasOwnProperty('id')) {
        callback(new Error('GameCopy.get() error: need to provide {id}'));
        return;
    }

    const sql = `
        SELECT Copy.id, Copy.status, Title.name AS title, Platform.name AS platform,
        Copy.dt_procured, Copy.library_tag
        FROM game_copies AS Copy
        JOIN game_releases AS GRelease
        ON GRelease.id = Copy.release_id
        JOIN game_platforms AS Platform
        ON Platform.id = GRelease.platform_id
        JOIN game_titles AS Title
        ON Title.id = GRelease.title_id
        WHERE Copy.id = :id
    ;`;

    const compiledQuery = compileSql(sql, {id: obj.id});
    connection.query(compiledQuery[0], compiledQuery[1], (err, rows, fields) => {
        if (rows.length > 1) {
            callback(new Error('GameCopy.get() error: returned more than one row'));
        }
        else if (rows.length == 0) {
            callback(new Error('GameCopy.get() error: did not find GameCopy with id: ${obj.id}'));
        }
        else {
            callback(err, rows[0], fields);
        }
    });
};

// create a game_copy from an object
// returns that game_copy
GameCopy.create = (obj, callback) => {
    if ( !("release_id" in obj && "library_tag" in obj && "dt_procured" in obj) ) {
        callback(new Error('GameCopy.create(): missing required parameters'));
        return;
    }

    const sql = `
        INSERT INTO game_copies
        (release_id, library_tag, dt_procured)
        VALUES
        (:release_id, :library_tag, :dt_procured)
        ;`

    const compiledQuery = compileSql(sql, obj);

    connection.query(compiledQuery[0], compiledQuery[1], (err, result, fields) => {
        if (err) {
            callback(err);
            return;
        }

        GameCopy.get({id: result.insertId}, (err, copy) => {
            callback(err, copy, fields);
        });
    });
};

// destroys a game_copy by id
// returns the sql result
GameCopy.destroy = (obj, callback) => {
    if (!obj.hasOwnProperty('id')) {
        callback(new Error('No id given for GameCopy.get()'));
        return;
    }

    const sql = `
        DELETE FROM game_copies
        WHERE game_copies.id = :id
        ;`;

    const compiledQuery = compileSql(sql, {id: obj.id});
    connection.query(compiledQuery[0], compiledQuery[1], (err, result) => {
        
        if (result.affectedRows === 0) {
            callback(new Error(`GameCopy.destroy() error: copy with id: ${obj.id} not found.`));
            return;
        }

        callback(err, result);
    });
};

// update a game_copy by id
// and return the game_copy
GameCopy.update = (obj, callback) => {
    if (!obj.hasOwnProperty('id') ) {
        callback(new Error('GameCopy.update() error: no id given'));
        return;
    }

    const sql = `
        UPDATE game_copies
        SET library_tag = :library_tag,
            dt_procured = :dt_procured
        WHERE id         = :id
        ;`;

    GameCopy.get({id: obj.id}, (err, copy) => {
        if (err) {
            callback(err);
            return;
        }

        const compiledQuery = compileSql(sql, {
            library_tag  : obj.library_tag  || copy.library_tag,
            dt_procured : obj.dt_procured   || copy.dt_procured,
            id           : obj.id,
        });

        connection.query(compiledQuery[0], compiledQuery[1], (err, result) => {
            if (err) {
                callback(err);
                return;
            }
            
            if (result.affectedRows === 0) {
                callback(new Error('GameCopy.update() error: row not changed'));
                return;
            }

            GameCopy.get({id: obj.id}, (err, copy) => {
                callback(err, copy);
            });
        });
    });
};

module.exports = GameCopy;
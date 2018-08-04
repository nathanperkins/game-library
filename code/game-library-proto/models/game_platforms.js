const connection = require('../db');
const compileSql = require('named-placeholders')();

const GamePlatform = {};

// returns all game_platforms as an array
// obj is not used here, but included for consistency
// with other models
GamePlatform.getAll = (obj, callback) => {
    const sql = `
        SELECT Platform.id, Platform.name, Platform.manufacturer, Platform.release_date, Platform.dt_created, Platform.dt_updated
        FROM game_platforms AS Platform
        ORDER BY id ASC
        ;`;

    connection.query(sql, (err, rows, fields) => {
        callback(err, rows, fields);
    });
};

// returns one game_platform by id    if object = {id} 
GamePlatform.get = (obj, callback) => {
    if ( obj.hasOwnProperty('id') ) {
        const sql = `
        SELECT Platform.id, Platform.name, Platform.manufacturer, Platform.release_date, Platform.dt_created, Platform.dt_updated
        FROM game_platforms AS Platform
        WHERE Platform.id = :id
        ;`;

        const compiledQuery = compileSql(sql, {id: obj.id});
        connection.query(compiledQuery[0], compiledQuery[1], (err, rows, fields) => {
            if (rows.length > 1) {
                callback(new Error('GamePlatform.get() error: returned more than one row'));
            }
            else if (rows.length == 0) {
                callback(new Error('GamePlatform.get() error: did not find GamePlatform with id: ${obj.id}'));
            }
            else {
                callback(err, rows[0], fields);
            }
        });
    }
    else {
        callback(new Error('GamePlatform.get() error: need to provide {id}'));
    }
};

// create a game_platform from an object
// returns that game_platform
GamePlatform.create = (obj, callback) => {
    if ( !("name" in obj && "manufacturer" in obj && "release_date" in obj) ) {
        callback(new Error('GamePlatform.create(): missing required parameters'));
        return;
    }

    const sql = `
        INSERT INTO game_platforms
        (name, manufacturer, release_date)
        VALUES
        (:name, :manufacturer, :release_date)
        ;`;

    const compiledQuery = compileSql(sql, obj);

    connection.query(compiledQuery[0], compiledQuery[1], (err, result, fields) => {
        if (err) {
            callback(err);
            return;
        }

        GamePlatform.get({id: result.insertId}, (err, platform) => {
            callback(err, platform, fields);
        });
    });
};

// destroys a game_platform by id
// returns the sql result
GamePlatform.destroy = (obj, callback) => {

    if ( obj.hasOwnProperty('id') ) {
        const sql = `
            DELETE FROM game_platforms
            WHERE game_platforms.id = :id
            ;`;

        const compiledQuery = compileSql(sql, {id: obj.id});
        connection.query(compiledQuery[0], compiledQuery[1], (err, result) => {
            
            if (result.affectedRows === 0) {
                callback(new Error(`GamePlatform.destroy() error: platform with id: ${obj.id} not found.`));
                return;
            }

            callback(err, result);
        });
    }
    else {
        callback(new Error('No id given for GamePlatform.get()'));
    }
};

// update a game_platform by id
// and return the game_platform
GamePlatform.update = (obj, callback) => {
    if (!obj.hasOwnProperty('id') ) {
        callback(new Error('GamePlatform.update() error: no id given'));
        return;
    }

    const sql = `
        UPDATE game_platforms
        SET name         = :name,
            manufacturer = :manufacturer,
            release_date = :release_date
        WHERE id         = :id
        ;`;

    GamePlatform.get({id: obj.id}, (err, platform) => {
        if (err) {
            callback(err);
            return;
        }

        const compiledQuery = compileSql(sql, {
            name         : obj.name         || platform.name,
            manufacturer : obj.manufacturer || platform.manufacturer,
            release_date : obj.release_date || platform.release_date,
            id           : obj.id,
        });

        connection.query(compiledQuery[0], compiledQuery[1], (err, result) => {
            if (err) {
                callback(err);
                return;
            }
            
            if (result.affectedRows === 0) {
                callback(new Error('GamePlatform.update() error: row not changed'));
                return;
            }

            GamePlatform.get({id: obj.id}, (err, platform) => {
                callback(err, platform);
            });
        });
    });
};

module.exports = GamePlatform;

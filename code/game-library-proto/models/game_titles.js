const connection = require('../db');
const compileSql = require('named-placeholders')();

const GameTitle = {};

// returns all game_titles as an array
// obj is not used here, but included for consistency
// with other models
GameTitle.getAll = (obj, callback) => {
    const sql = `
        SELECT Title.id, Title.name, Title.genre, Title.developer, Title.producer
        FROM game_titles AS Title
        ORDER BY id ASC
        ;`;

    connection.query(sql, (err, rows, fields) => {
        callback(err, rows, fields);
    });
};

// returns one game_title by id    if object = {id} 
GameTitle.get = (obj, callback) => {
    if ( obj.hasOwnProperty('id') ) {
        const sql = `
        SELECT Title.id, Title.name, Title.description, Title.genre, Title.developer, Title.producer
        FROM game_titles AS Title
        WHERE Title.id = :id
        ;`;

        const compiledQuery = compileSql(sql, {id: obj.id});
        connection.query(compiledQuery[0], compiledQuery[1], (err, rows, fields) => {
            if (rows.length > 1) {
                callback(new Error('GameTitle.get() error: returned more than one row'));
            }
            else if (rows.length == 0) {
                callback(new Error('GameTitle.get() error: did not find GameTitle with id: ${obj.id}'));
            }
            else {
                callback(err, rows[0], fields);
            }
        });
    }
    else {
        callback(new Error('GameTitle.get() error: need to provide {id}'));
    }
};

// create a game_title from an object
// returns that title
GameTitle.create = (obj, callback) => {
    if ( !("name" in obj && "description" in obj && "genre" in obj && "developer" in obj && "producer" in obj) ) {
        callback(new Error('GameTitle.create(): missing required parameters'));
        return;
    }

    const sql = `
        INSERT INTO game_titles
        (name, description, genre, developer, producer)
        VALUES
        (:name, :description, :genre, :developer, :producer)
        ;`

    const compiledQuery = compileSql(sql, obj);

    connection.query(compiledQuery[0], compiledQuery[1], (err, result, fields) => {
        if (err) {
            callback(err);
            return;
        }

        GameTitle.get({id: result.insertId}, (err, title) => {
            callback(err, title, fields);
        });
    });
};

// destroys a game_title by id
// returns the sql result
GameTitle.destroy = (obj, callback) => {

    if ( obj.hasOwnProperty('id') ) {
        const sql = `
            DELETE FROM game_titles
            WHERE game_titles.id = :id
            ;`;

        const compiledQuery = compileSql(sql, {id: obj.id});
        connection.query(compiledQuery[0], compiledQuery[1], (err, result) => {
            
            if (result.affectedRows === 0) {
                callback(new Error(`GameTitle.destroy() error: title with id: ${obj.id} not found.`));
                return;
            }

            callback(err, result);
        });
    }
    else {
        callback(new Error('No id given for GameTitle.get()'));
    }
};

// update a game_title by id
// and return the game_title
GameTitle.update = (obj, callback) => {
    if (!obj.hasOwnProperty('id') ) {
        callback(new Error('GameTitle.update() error: no id given'));
        return;
    }

    const sql = `
        UPDATE game_titles
        SET name        = :name,
            description = :description,
            genre       = :genre,
            developer   = :developer,
            producer    = :producer
        WHERE id        = :id
        ;`;

    GameTitle.get({id: obj.id}, (err, title) => {
        if (err) {
            callback(err);
            return;
        }

        const compiledQuery = compileSql(sql, {
            name         : obj.name        || title.name,
            description  : obj.description || title.description,
            genre        : obj.genre       || title.genre,
            developer    : obj.developer   || title.developer,
            producer     : obj.producer    || title.producer,
            id           : obj.id,
        });

        connection.query(compiledQuery[0], compiledQuery[1], (err, result) => {
            if (err) {
                callback(err);
                return;
            }
            
            if (result.affectedRows === 0) {
                callback(new Error('GameTitle.update() error: row not changed'));
                return;
            }

            GameTitle.get({id: obj.id}, (err, title) => {
                callback(err, title);
            });
        });
    });
};

module.exports = GameTitle;

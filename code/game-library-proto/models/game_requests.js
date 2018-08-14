const connection = require('../db');
const compileSql = require('named-placeholders')();

const GameRequest = {};

// returns all game_requests as an array
// obj is not used here, but included for consistency
// with other models
GameRequest.getAll = (obj, callback) => {
    const sql = `SELECT Request.id, Request.dt_completed, Request.dt_requested, Request.dt_delivered, Request.dt_completed,
    Title.name AS title, Platform.name AS platform, 
    CONCAT(User.first_name, ' ', User.last_name) AS user, User.id as user_id, 
    GRelease.id as release_id, 
    Copy.id as copy_id, Copy.library_tag
  FROM game_requests AS Request
  JOIN game_releases AS GRelease
    ON GRelease.id = Request.release_id
  JOIN game_titles AS Title
    ON Title.id = GRelease.title_id
  JOIN game_platforms AS Platform
    ON Platform.id = GRelease.platform_id
  JOIN users AS User
    ON User.id = Request.user_id
  LEFT JOIN game_copies AS Copy
    ON Copy.id = Request.copy_id
  ;`

    connection.query(sql, (err, rows, fields) => {
        callback(err, rows, fields);
    });
};

GameRequest.getAllByStatus = (status, callback) => {
    GameRequest.getAll({}, (err, rows, fields) => {
        if (err) throw err;

        let requests = [];

        if (status == "pending") {
            requests = rows.filter(row => !row.dt_delivered && !row.dt_completed);
        }
        else if (status == "checked_out") {
            requests = rows.filter(row => row.dt_delivered && !row.dt_completed);
        }
        else if (status == "completed") {
            requests = rows.filter(row => !!row.dt_completed);
        }
        else {
            throw new Error("invalid status");
        }

        callback(err, requests, fields);
    });
};

// returns one game_release by id    if object = {id} 
GameRequest.get = (obj, callback) => {
    if (!obj.hasOwnProperty('id')) {
        callback(new Error('GameRequest.get() error: need to provide {id}'));
        return;
    }
    
    const sql = `SELECT Request.id, Request.dt_completed, Request.dt_requested, Request.dt_delivered, Request.dt_completed,
    Title.name AS title, Platform.name AS platform, 
    CONCAT(User.first_name, ' ', User.last_name) AS user, User.id as user_id, 
    GRelease.id as release_id, 
    Copy.id as copy_id, Copy.library_tag
  FROM game_requests AS Request
  JOIN game_releases AS GRelease
    ON GRelease.id = Request.release_id
  JOIN game_titles AS Title
    ON Title.id = GRelease.title_id
  JOIN game_platforms AS Platform
    ON Platform.id = GRelease.platform_id
  JOIN users AS User
    ON User.id = Request.user_id
  LEFT JOIN game_copies AS Copy
    ON Copy.id = Request.copy_id 
  WHERE Request.id = :id
  ;`

    const compiledQuery = compileSql(sql, {id: obj.id});

    connection.query(compiledQuery[0], compiledQuery[1], (err, rows, fields) => {
        if (err) throw err;
        if (rows.length > 1) {
            callback(new Error('GameRequest.get() error: returned more than one row'));
        }
        else if (rows.length == 0) {
            callback(new Error(`GameRequest.get() error: did not find GameRequest with id: ${obj.id}`));
        }
        else {
            callback(err, rows[0], fields);
        }
    });
};

// create a game_release from an object
// returns that game_release
GameRequest.create = (obj, callback) => {
    if ( !("user_id" in obj && "release_id" in obj) ) {
        callback(new Error('GameRequest.create(): missing required parameters'));
        return;
    }

    const sql = `
        INSERT INTO game_requests
        (user_id, release_id)
        VALUES
        (:user_id, :release_id)
        ;`
    
    const compiledQuery = compileSql(sql, obj);

    connection.query(compiledQuery[0], compiledQuery[1], (err, result, fields) => {
        if (err) {
            callback(err);
            return;
        }

        GameRequest.get({id: result.insertId}, (err, release) => {
            callback(err, release, fields);
        });
    });
};

// destroys a game_release by id
// returns the sql result
GameRequest.destroy = (obj, callback) => {
    if (!obj.hasOwnProperty('id')) {
        callback(new Error('No id given for GameRequest.destroy()'));
        return;
    }

    const sql = `
        DELETE FROM game_requests
        WHERE game_requests.id = :id
        ;`;

    const compiledQuery = compileSql(sql, {id: obj.id});
    connection.query(compiledQuery[0], compiledQuery[1], (err, result) => {
        
        if (result.affectedRows === 0) {
            callback(new Error(`GameRequest.destroy() error: release with id: ${obj.id} not found.`));
            return;
        }

        callback(err, result);
    });
};

// update a game_release by id
// and return the game_release
GameRequest.update = (obj, callback) => {
    if (!obj.hasOwnProperty('id') ) {
        callback(new Error('GameRequest.update() error: no id given'));
        return;
    }

    const sql = ` 
        UPDATE game_requests
        SET user_id      = :user_id, 
            release_id   = :release_id, 
            dt_requested = :dt_requested, 
            dt_delivered  = :dt_delivered, 
            dt_completed = :dt_completed 
        WHERE id         = :id 
        ;`; 

    GameRequest.get({id: obj.id}, (err, release) => {
        if (err) {
            callback(err);
            return;
        }

        const compiledQuery = compileSql(sql, {
            user_id      : obj.user_id      || release.user_id, 
            release_id   : obj.release_id   || release.release_id, 
            dt_requested : obj.dt_requested || release.dt_requested, 
            dt_delivered : obj.dt_delivered || release.dt_delivered, 
            dt_completed : obj.dt_completed || release.dt_completed, 
            id           : obj.id,
        });

        connection.query(compiledQuery[0], compiledQuery[1], (err, result) => {
            if (err) {
                callback(err);
                return;
            }
            
            if (result.affectedRows === 0) {
                callback(new Error('GameRequest.update() error: row not changed'));
                return;
            }

            GameRequest.get({id: obj.id}, (err, release) => {
                callback(err, release);
            });
        });
    });
};

module.exports = GameRequest;

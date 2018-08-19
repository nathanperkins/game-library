const bcrypt     = require('bcrypt');
const connection = require('../db');
const compileSql = require('named-placeholders')();

const User = {};

// returns all users as an array
// obj is not used here, but included for consistency
// with other models
User.getAll = (obj, callback) => {
    const sql = `
        SELECT User.id, User.last_name, User.first_name, User.email, User.role
        FROM users AS User
        ORDER BY User.last_name, User.first_name DESC
        ;`;

    connection.query(sql, (err, rows, fields) => {
        callback(err, rows, fields);
    });
};

// returns one user by id    if object = {id} 
// returns one user by email if object = {email}
User.get = (obj, callback) => {

    function genericGet(query, param, callback) {
        connection.query(query, param, (err, rows, fields) => {
            if (rows.length > 1) {
                callback(new Error('User.get() error: returned more than one row'));
            }
            else if (rows.length == 0) {
                callback(new Error(`User.get() error: did not find user with parameter: ${param}`));
            }
            else {
                callback(err, rows[0], fields);
            }
        });
    }
    
    if (obj.hasOwnProperty('id')) {
        const sql = `
        SELECT User.id, User.last_name, User.first_name, User.email, User.role
        FROM users AS User
        WHERE User.id = :id
        ;`

        const compiledQuery = compileSql(sql, {id: obj.id});
        genericGet(compiledQuery[0], compiledQuery[1], callback);
    } 
    else if (obj.hasOwnProperty('email')) {
        const sql = `
        SELECT User.id, User.last_name, User.first_name, User.email, User.role
        FROM users AS User
        WHERE User.email = :email
        ;`

        const compiledQuery = compileSql(sql, {email: obj.email});
        genericGet(compiledQuery[0], compiledQuery[1], callback);
    }
    else {
        callback(new Error('No property given for User.get()'));
    }
};

// create a user from an object
// returns that user
User.create = (obj, callback) => {
    if ( !("first_name" in obj && "last_name" in obj && "email" in obj && "password" in obj && "role" in obj) ) {
        callback(new Error('User.create(): missing required parameters'));
        return;
    }

    const sql = `
        INSERT INTO users
        (first_name, last_name, email, password, role)
        VALUES
        (:first_name, :last_name, :email, :password, :role)
        ;`

    bcrypt.hash(obj.password, 10, (err, hash) => {
        const compiledQuery = compileSql(sql, {
            first_name : obj.first_name,
            last_name  : obj.last_name,
            email      : obj.email,
            password   : hash,
            role       : obj.role,
        });

        connection.query(compiledQuery[0], compiledQuery[1], (err, result, fields) => {
            if (err) {
                callback(err);
                return;
            }

            User.get({id: result.insertId}, (err, user) => {
                callback(err, user, fields);
            });
        });
    });
};

// get login info for a user by email or id
// returns only the User.id, User.email and User.password
User.password = (obj, callback) => {

    if (obj.hasOwnProperty('email')) {
        const sql = 
            `SELECT User.*
            FROM users AS User
            WHERE User.email = :email
            ;`;

        const compiledQuery = compileSql(sql, {email: obj.email});
        connection.query(compiledQuery[0], compiledQuery[1], (err, rows, fields) => {
            if (rows.length !== 1) {
                callback(new Error(`User.password() error: user with email ${obj.email} not found.`));
                return;
            }
            callback(err, rows[0], fields);
        });
    }
    else if (obj.hasOwnProperty('id')) {
        const sql = 
            `SELECT User.id, User.email, User.password
            FROM users AS User
            WHERE User.id = :id
            ;`;
        
        const compiledQuery = compileSql(sql, {id: obj.id});
        connection.query(compiledQuery[0], compiledQuery[1], (err, rows, fields) => {
            if (rows.length !== 1) {
                callback(new Error(`User.password() error: user with id ${obj.id} not found.`));
                return;
            }
            callback(err, rows[0] || {}, fields);
        });
    }
    else {
        callback(new Error('User.password() error: needs id or email'));
    }
};

// compares the password with the password for the given account
User.login = (obj, callback) => {
    if (!(obj.hasOwnProperty('email') && obj.hasOwnProperty('password'))) {
        callback(new Error('Missing email or password for User.login()'), false);
        return;
    }

    User.password({email: obj.email}, (err, user) => { 
        if (!user) {
            callback(null, false)
            return
        }

        bcrypt.compare(obj.password, user.password || obj.password, (err, res) => {
            if (err) {
                callback(err, false)
                return
            }

            if (!res) {
                callback(null, false)
                return
            }

            delete user.password;
            callback(null, user);
        });
    });
};

// destroys a user by id
// returns the sql result
User.destroy = (obj, callback) => {
    if (!obj.hasOwnProperty('id')) {
        callback(new Error('No id given for User.get()'));
        return;
    };
    
    const sql = `
        DELETE FROM users
        WHERE users.id = :id
        ;`;

    const compiledQuery = compileSql(sql, {id: obj.id});
    connection.query(compiledQuery[0], compiledQuery[1], (err, result) => {
        
        if (result.affectedRows === 0) {
            callback(new Error(`User.destroy() error: user with id: ${obj.id} not found.`));
            return;
        }

        callback(err, result);
    });
};

// update a user's password
User.updatePassword = (obj, callback) => {
    if (!(obj.hasOwnProperty('id') && obj.hasOwnProperty('password'))) {
        callback(new Error("User.updatePassword() error: missing id or password"));
    }

    bcrypt.hash(obj.password, 10, (err, hash) => {
        const sql = 
        `UPDATE users
          SET password = :hash
        WHERE id = :id;`;

        const compiledQuery = compileSql(sql, {id: obj.id, hash: hash});

        connection.query(compiledQuery[0], compiledQuery[1], (err, result) => {
            if (result.affectedRows < 1) {
                callback(new Error(`User.updatePassword() error: no change made`));
            }
            if (err) callback(err);

            callback(err, result);
        });
    });
}

// update a user by id
// and return the user
User.update = (obj, callback) => {
    if (obj.hasOwnProperty('password') ) {
        callback(new Error('User.update() error: please use User.updatePassword() to change password'));
        return;
    }

    if (!obj.hasOwnProperty('id') ) {
        callback(new Error('User.update() error: no id given'));
        return;
    }

    const sql = `
        UPDATE users
        SET first_name = :first_name,
            last_name  = :last_name,
            email      = :email,
            role       = :role
        WHERE id       = :id
        ;`;

    User.get({id: obj.id}, (err, user) => {
        if (err) {
            callback(err);
            return;
        }

        const compiledQuery = compileSql(sql, {
            first_name : obj.first_name || user.first_name,
            last_name  : obj.last_name  || user.last_name,
            email      : obj.email      || user.email,
            role       : obj.role       || user.role,
            id         : obj.id
        });

        connection.query(compiledQuery[0], compiledQuery[1], (err, result) => {
            if (err) {
                callback(err);
                return;
            }
            
            if (result.affectedRows === 0) {
                callback(new Error('User.update() error: row not changed'));
                return;
            }

            User.get({id: obj.id}, (err, user) => {
                callback(err, user);
            });
        });
    });
};

module.exports = User;
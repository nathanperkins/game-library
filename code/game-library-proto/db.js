const config = require('config');
const mysql = require('mysql');
const db_config = config.get('db');
const pool   = mysql.createPool(db_config);
const execSQL = require('exec-sql');

// create or reset tables using create_tables.sql
pool.createTables = function(callback) {
    execSQL.connect(db_config);
    execSQL.executeFile(__dirname + '/sql/create_tables.sql', (err) => {
        execSQL.disconnect();
        callback(err);
    });
}

// insert the dummy data from insert_dummy_data.sql
pool.insertDummyData = function(callback) {
    execSQL.connect(db_config);
    execSQL.executeFile(__dirname + '/sql/insert_dummy_data.sql', (err) => {
        execSQL.disconnect();
        callback(err);
    });
}

module.exports = pool;
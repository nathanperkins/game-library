const config = require('config');
const mysql = require('mysql');
const db_config = config.get('db');
const pool   = mysql.createPool(db_config);
const execSQL = require('exec-sql');

// create or reset tables using 1_ddl.sql
pool.createTables = function(callback) {
    execSQL.connect(db_config);
    execSQL.executeFile(__dirname + '/mariadb/sql/1_ddl.sql', (err) => {
        execSQL.disconnect();
        callback(err);
    });
}

// insert the dummy data from 2_dump.sql
pool.insertDummyData = function(callback) {
    execSQL.connect(db_config);
    execSQL.executeFile(__dirname + '/mariadb/sql/2_dump.sql', (err) => {
        execSQL.disconnect();
        callback(err);
    });
}

module.exports = pool;
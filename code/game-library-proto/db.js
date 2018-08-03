const config = require('config');
const mysql = require('mysql');
const db_config = config.get('db');
const connection = mysql.createConnection(db_config);
const pool   = mysql.createPool(config.get('db'));
const execSQL = require('exec-sql');

// keep db connection alive by making a query every 10 seconds
// https://stackoverflow.com/a/28215691/8092467
setInterval(function () {
    connection.query('SELECT 1');
}, 10000);

connection.createTables = function(callback) {
    execSQL.connect(db_config);
    execSQL.executeFile(__dirname + '/sql/create_tables.sql', (err) => {
        execSQL.disconnect();
        callback(err);
    });
}

connection.insertDummyData = function(callback) {
    execSQL.connect(db_config);
    execSQL.executeFile(__dirname + '/sql/insert_dummy_data.sql', (err) => {
        execSQL.disconnect();
        callback(err);
    });
}

module.exports = connection;
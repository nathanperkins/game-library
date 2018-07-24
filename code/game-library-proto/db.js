const config = require('./config');
const mysql = require('mysql');
const connection = mysql.createConnection(config.db);

// keep db connection alive by making a query every 10 seconds
// https://stackoverflow.com/a/28215691/8092467
setInterval(function () {
    connection.query('SELECT 1');
}, 10000);

module.exports = connection;
const routes = require('express').Router();
const queries = require('../queries');
const connection = require('../db');

routes.get('/', (req, res) => {
    const data = {
        page_title: 'Requests',
    };

    connection.query(queries.get_all_game_requests, (err, rows, fields) => {
        if (err) throw err;

        data.rows = rows;
        res.render('game_requests/index', data);
    });
});


routes.get('/new/', (req, res) => {
    const data = {
        page_title  : 'Library',
        msg         : `Added request for release_id: ${req.query.release_id}`,
        search      : null,
    };

    connection.query(queries.get_all_game_releases_with_search, ['%', '%'], (err, rows, fields) => {
        if (err) throw err;

        data.rows = rows;
        res.render('library/index', data);
    });
});

module.exports = routes;
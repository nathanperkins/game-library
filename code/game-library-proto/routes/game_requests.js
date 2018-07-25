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

routes.get('/pending/', (req, res) => {
    const data = {
        page_title: 'Requests',
    };

    connection.query(queries.get_game_requests_by_status, ['pending'], (err, rows, fields) => {
        if (err) throw err;

        data.rows = rows;
        res.render('game_requests/pending', data);
    });
});

routes.get('/checked_out/', (req, res) => {
    const data = {
        page_title: 'Requests',
    };

    connection.query(queries.get_game_requests_by_status, ['checked_out'], (err, rows, fields) => {
        if (err) throw err;

        data.rows = rows;
        res.render('game_requests/checked_out', data);
    });
});

routes.get('/completed/', (req, res) => {
    const data = {
        page_title: 'Requests',
    };

    connection.query(queries.get_game_requests_by_status, ['completed'], (err, rows, fields) => {
        if (err) throw err;

        data.rows = rows;
        res.render('game_requests/completed', data);
    });
});

module.exports = routes;
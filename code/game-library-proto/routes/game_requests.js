const routes = require('express').Router();
const queries = require('../queries');
const connection = require('../db');

const GameRequest = require('../models/game_requests');

routes.get('/', (req, res) => {
    const data = {
        page_title: 'Requests',
    };

    GameRequest.getAll({}, (err, rows, fields) => {
        if (err) throw err;

        data.rows = rows;
        res.render('game_requests/index', data);
    });
});


routes.get('/new/', (req, res) => {
    const data = {
        page_title  : 'Library',
        search      : null,
    };

    req.flash('success', `${req.query.game_title} requested!`);

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

    GameRequest.getAllByStatus("pending", (err, rows, fields) => {
        if (err) throw err;

        data.rows = rows;
        res.render('game_requests/pending', data);
    });
});

routes.get('/checked_out/', (req, res) => {
    const data = {
        page_title: 'Requests',
    };

    GameRequest.getAllByStatus("checked_out", (err, rows, fields) => {
        if (err) throw err;

        data.rows = rows;
        res.render('game_requests/checked_out', data);
    });
});

routes.get('/completed/', (req, res) => {
    const data = {
        page_title: 'Requests',
    };

    GameRequest.getAllByStatus("completed", (err, rows, fields) => {
        if (err) throw err;

        data.rows = rows;
        res.render('game_requests/completed', data);
    });
});

routes.post('/', (req, res) => {
    if (!req.session.user) {
        res.flash('warning', "Must login before making a requests");
        res.redirect('/users/login');
    }
    console.log("Creating Request: ", req.body);

    GameRequest.create(req.body, (err, request) => {

    });
});

routes.delete('/:request_id', (req, res) => {
    console.log("attempted to delete: ", req.params.request_id);

    GameRequest.destroy({id: req.params.request_id}, (err, rows, fields) => {
        if (err) throw err;

        req.flash('success', "Request was deleted!");
        res.redirect('/game_requests/');
    });
})

module.exports = routes;
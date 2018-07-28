const routes = require('express').Router();
const queries = require('../queries');
const connection = require('../db');

routes.get('/new', (req, res) => {
    const data = {
        page_title  : 'New Game Copy',
    };

    res.render('game_copies/new', data);
});

routes. get('/', (req, res) => {
    const context = {
        page_title  : "Game Copies Index",
        table_name  : "game_copies",
        pretty_name : "Game Copies",
    }

    connection.query(queries.get_all_game_copies, (err, rows, fields) => {
        if (err) throw err;

        context.rows   = rows;
        context.fields = [
            'Title',
            'Platform',
            'Library Tag',
        ]

        res.render('generic/table', context);
    });
});

module.exports = routes;
const routes = require('express').Router();
const queries = require('../queries');
const connection = require('../db');

routes. get('/', (req, res) => {
    const context = {
        page_title  : "Game Releases Index",
        table_name  : "game_releases",
        pretty_name : "Game Releases",
    }

    connection.query(queries.get_all_game_releases, (err, rows, fields) => {
        if (err) throw err;

        context.rows   = rows;
        context.fields = [
            'Title',
            'Platform',
            'Release Date',
        ]

        rows.forEach( row => row.release_date = row.release_date.toLocaleDateString('en-US') );

        res.render('generic/table', context);
    });
});

routes.get('/new', (req, res) => {
    const data = {
        page_title  : 'New Game Release',
    };

    res.render('game_releases/new', data);
});

module.exports = routes;
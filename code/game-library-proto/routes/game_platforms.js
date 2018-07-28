const routes = require('express').Router();
const queries = require('../queries');
const connection = require('../db');

routes. get('/', (req, res) => {
    const context = {
        page_title  : "Game Platform Index",
        table_name  : "game_platforms",
        pretty_name : "Game Platform",
    }

    connection.query(queries.get_all_game_platforms, (err, rows, fields) => {
        if (err) throw err;

        context.rows   = rows;
        context.fields = [
            'ID',
            'Name',
            'Manufacturer',
            'Release Date',
        ]

        rows.forEach( row => row.release_date = row.release_date.toLocaleDateString('en-US') );

        res.render('generic/table', context);
    });
});

routes.get('/new', (req, res) => {
    const data = {
        page_title  : 'New Game Platform',
    };

    res.render('game_platforms/new', data);
});

module.exports = routes;
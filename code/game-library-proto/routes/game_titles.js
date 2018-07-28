const routes = require('express').Router();
const queries = require('../queries');
const connection = require('../db');

routes. get('/', (req, res) => {
    const context = {
        page_title  : "Game Title Index",
        table_name  : "game_titles",
        pretty_name : "Game Title",
    }

    connection.query(queries.get_all_game_titles, (err, rows, fields) => {
        if (err) throw err;


        context.rows   = rows;
        context.fields = [
            'ID',
            'Name',
            'Genre',
            'Developer',
            'Producer',
        ]

        res.render('generic/table', context);
    });
});

routes. get('/', (req, res) => {
    const context = {
        page_title : "Game Title Index",
    }

    connection.query(queries.get_all_game_titles, (err, rows, fields) => {
        if (err) throw err;

        context.titles = rows;

        res.render('game_titles/index', context);
    });
});

routes.get('/new', (req, res) => {
    const context = {
        page_title  : 'New Game Title',
    };

    res.render('game_titles/new', context);
});

module.exports = routes;
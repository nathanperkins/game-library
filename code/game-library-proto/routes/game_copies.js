const routes = require('express').Router();
const queries = require('../queries');
const connection = require('../db');

routes.get('/new', (req, res) => {
    const data = {
        page_title  : 'New Game Copy',
        errors      : null,
        msg         : null,
    };

    res.render('game_copies/new', data);
});

module.exports = routes;
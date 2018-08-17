const routes = require('express').Router();

const { body, validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');

const app         = require('../app');
const db          = require(__basedir + '/db');
const GameRelease = require(__basedir + '/models/game_releases');

routes.get('/', (req, res) => {
    const data = {
        page_title: 'Root',
    };

    res.render('index', data);
});

routes.get('/reset-db', (req, res) => {
    console.log("Resetting tables");

    connection.createTables(err => {
        if (err) throw err;
        connection.insertDummyData(err => {
            if (err) throw err;
            req.flash("success", "Database has been reset.");
            res.redirect('/');
        });
    });
});

routes.use('/game_copies/',    require('./game_copies'));
routes.use('/game_platforms/', require('./game_platforms'));
routes.use('/game_releases/',  require('./game_releases'));
routes.use('/game_requests/',  require('./game_requests'));
routes.use('/game_titles/',    require('./game_titles'));
routes.use('/users/',          require('./users'));

routes.get('/library/', (req, res) => {
    const data = {
        page_title : 'Library',
    };

    GameRelease.search(req.query, (err, rows, fields) => {
        if (err) throw err;

        data.rows = rows;
        data.search = req.query.title;
        res.render('library/index', data);
    });
});

routes.get('/admin/', (req, res) => {
    const data = {
        page_title  : 'Admin',
    };

    res.render('admin/index', data);
});

// handle 404 - NOT FOUND
routes.use(function (req, res, next) {
    res.status(404).send("404 - Not Found");
});
  
// handle 500 - SERVER ERROR
routes.use(function (err, req, res, next) {
    console.error(err.stack);
    res.status(500).send('500 - Internal Server Error')
});

module.exports = routes;
const routes = require('express').Router();

const queries = require('../queries');
const connection = require('../db');

// express-validator used to validate and clean form data
// from https://express-validator.github.io/docs/
// uses validator.js
// from https://github.com/chriso/validator.js
const { body, validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');

routes.get('/', (req, res) => {
    const data = {
        page_title: 'Root',
    };

    // renders views/index.ejs, passing in data for use in the template
    res.render('index', data);
});


const game_copy_routes = require('./game_copies');
const game_platform_routes = require('./game_platforms');
const game_release_routes = require('./game_releases');
const game_request_routes = require('./game_requests');
const game_title_routes = require('./game_titles');
const user_routes = require('./users');

routes.use('/game_copies/', game_copy_routes);
routes.use('/game_platforms/', game_platform_routes);
routes.use('/game_releases/', game_release_routes);
routes.use('/game_requests/', game_request_routes);
routes.use('/game_titles/', game_title_routes);
routes.use('/users/', user_routes);

routes.get('/library/', (req, res) => {
    const data = {
        page_title : 'Library',
        search     : null, 
    };

    let search = `%`;

    if (req.query.title) {
        search = `%${req.query.title}%`;
        data.search = req.query.title;
    }

    connection.query(queries.get_all_game_releases_with_search, [search, search], (err, rows, fields) => {
        if (err) throw err;

        data.rows = rows;
        res.render('library/index', data);
    });
});

routes.get('/admin/', (req, res) => {
    const data = {
        page_title  : 'Admin',
    };

    res.render('admin/index', data);
});

module.exports = routes;
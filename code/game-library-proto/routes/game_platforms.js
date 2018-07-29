const routes = require('express').Router();
const queries = require('../queries');
const connection = require('../db');

// express-validator used to validate and clean form data
// from https://express-validator.github.io/docs/
// uses validator.js
// from https://github.com/chriso/validator.js
const { body, validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');

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

routes.post('/', [
        // validations from express-validator
        body(['name', 'manufacturer']).trim()
        .isAscii().withMessage('must be ASCII characters only'),
    ], (req, res) => {
    const errors = validationResult(req);

    const data = {
        page_title: 'Add Platform',
        errors: errors.array(), 
    };

    if (!errors.isEmpty()) {
        res.render('game_platforms/new', data);
    } else {

            // parameters for insert query
            const newPlatform = [
                req.body.name,
                req.body.manufacturer,
                req.body.release_date
            ];

            connection.query(queries.insert_new_platform, newPlatform, (err, rows) => {
                if (err) throw err;

                res.redirect('/game_platforms/new/');
            });
        
    }
});

module.exports = routes;
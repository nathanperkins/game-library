const routes = require('express').Router();
const queries = require('../queries');
const connection = require('../db');
const querystring = require('querystring');

// express-validator used to validate and clean form data
// from https://express-validator.github.io/docs/
// uses validator.js
// from https://github.com/chriso/validator.js
const { body, validationResult } = require('express-validator/check');

routes.get('/', (req, res) => {
    const context = {
        page_title: "Game Releases Index",
        table_name: "game_releases",
        pretty_name: "Game Release",
    }

    connection.query(queries.get_all_game_releases, (err, rows) => {
        if (err) throw err;

        context.rows = rows;
        context.fields = [
            'ID',
            'Title',
            'Platform',
            'Release Date',
        ]

        rows.forEach(row => {
            if (row.release_date) row.release_date = row.release_date.toLocaleString("en-US", {timeZone: "UTC"});
        });

        res.render('game_releases/index', context);
    });
});

routes.get('/new', (req, res) => {

    const data = {
        page_title: 'New Game Release',
        game_title: req.query.game_title,
        game_id: req.query.game_id
    };

    connection.query(queries.get_all_game_platforms, (err, rows) => {
        if (err) throw err;

        data.rows = rows;

        res.render('game_releases/new', data);
    });

});

routes.post('/', [
    // validations from express-validator
    body('boxart_url').trim().optional()
        .isURL().withMessage('must be a valid URL only'),
], (req, res) => {

    const errors = validationResult(req);

    const data = {
        page_title: 'New Game Release',
        game_title: req.body.game_title,
        game_id: req.body.game_id,
    };

    if (!errors.isEmpty()) {

        errors.array().forEach(error => {
            req.flash('danger', `${error.param} error: ${error.msg}`);
        });

        const query = querystring.stringify(data);
        res.redirect('/game_releases/new?' + query);

    } else {
        const platform_name = req.body.platform_name;
        const game_title = req.body.game_title;

        // parameters for insert query
        const newRelease = [
            req.body.game_id,
            req.body.platform_id,
            req.body.rating || null,
            req.body.boxart_url || null,
            req.body.release_date || null,
        ]

        connection.query(queries.insert_new_release, newRelease, (err) => {
            if (err)
                req.flash('danger', `${game_title} on ${platform_name} is already in the library.`);
    
            else
                req.flash('success', `Release created: ${game_title} on ${platform_name}!`);

            res.redirect('/game_releases/');
            
        });
    }
});

module.exports = routes;
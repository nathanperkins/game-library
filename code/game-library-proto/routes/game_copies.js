const routes = require('express').Router();
const queries = require('../queries');
const connection = require('../db');
const querystring = require('querystring');

// express-validator used to validate and clean form data
// from https://express-validator.github.io/docs/
// uses validator.js
// from https://github.com/chriso/validator.js
const { body, validationResult } = require('express-validator/check');

routes.get('/new', (req, res) => {
    const data = {
        page_title: 'New Game Copy',
        game_title: req.query.release_title,
        game_platform: req.query.release_platform,
        release_id: req.query.release_id
    };

    res.render('game_copies/new', data);
});

routes.get('/', (req, res) => {
    const context = {
        page_title: "Game Copies Index",
        table_name: "game_copies",
        pretty_name: "Game Copy",
    }

    connection.query(queries.get_all_game_copies, (err, rows, fields) => {
        if (err) throw err;

        context.rows = rows;
        context.fields = [
            'Title',
            'Platform',
            'Library Tag',
        ]

        res.render('game_copies/index', context);
    });
});

routes.post('/', [
    // validations from express-validator
    body('library_tag').trim()
        .isInt().withMessage('must contain numbers only'),
], (req, res) => {
    const errors = validationResult(req);

    const query = {
        page_title: 'New Game Copy',
        game_title: req.body.release_title,
        game_platform: req.body.release_platform,
        release_id: req.body.release_id
    };

    if (!errors.isEmpty()) {

        errors.array().forEach(error => {
            req.flash('danger', `${error.param} error: ${error.msg}`);
        });

        const query = querystring.stringify(data);
        res.redirect('/game_copies/new?' + query);

    } else {

        const library_tag = req.body.library_tag;
        const game_title = req.body.game_title;
        const game_platform = req.body.game_platform;

        // parameters for insert query
        const newCopy = [
            req.body.status,
            req.body.release_id,
            library_tag,
            req.body.dt_procured
        ]

        console.log(req.body.status);

        connection.query(queries.insert_new_copy, newCopy, (err) => {
            if (err) throw err;

            req.flash('success', `Copy created: Tag #${library_tag}: ${game_title} on ${game_platform}!`);

            res.redirect('/game_copies/');
        });
    }
});

module.exports = routes;
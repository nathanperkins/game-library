const routes = require('express').Router();
const querystring = require('querystring');

const GameCopy = require('../models/game_copies');
const GameRelease = require('../models/game_releases');

// express-validator used to validate and clean form data
// from https://express-validator.github.io/docs/
// uses validator.js
// from https://github.com/chriso/validator.js
const { body, validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');

routes.get('/', (req, res) => {
    const context = {
        page_title: "Game Copies Index",
        table_name: "game_copies",
        pretty_name: "Game Copy",
    }

    GameCopy.getAll({}, (err, rows, fields) => {
        if (err) throw err;

        context.rows = rows;
        context.fields = [
            {name: 'id',            pretty: 'ID'},
            {name: 'status',        pretty: 'Status'},
            {name: 'title',         pretty: 'Title'},
            {name: 'platform',      pretty: 'Platform'},
            {name: 'library_tag',   pretty: 'Library Tag'},
        ]

        res.render('game_copies/index', context);
    });
});

routes.get('/new', (req, res) => {
    const data = {
        page_title: 'New Game Copy',
        page_heading: 'Add a new copy of ',
        endpoint: '/game_copies/',
        method: 'POST',
        redirect: '/game_copies/new?',
        release_id: req.query.release_id,
        copy_id: null,
        library_tag: null,
        dt_procured: null
    };

    GameRelease.get({id: req.query.release_id}, (err, release) => {
        if (err) throw err;

        data.release = release;

        res.render('game_copies/form', data);
    });

    
});


/* Route for updating a game copy - brings values from the table to
 * the /new form to auto-populate with current DB values, which submits
 * to /update POST to update the DB with new values*/

routes.get('/update', (req, res) => {

    const data = {
        page_title: 'Edit Game Copy',
        page_heading: 'Update this copy of',
        endpoint: '/game_copies/update',
        method: 'POST',
        redirect: '/game_copies/update?',
        copy_id: req.query.copy_id,
        game_title: null,
        game_platform: null,
        release_id: null,
        library_tag: null,
        dt_procured: null
    };

    const copy_id = req.query.copy_id;

    GameCopy.get({id: copy_id}, (err, copy, fields) => {
        if (err) throw err;

        data.game_title = copy.title;
        data.game_platform = copy.platform;
        data.library_tag = copy.library_tag;

        var date = new Date(copy.dt_procured);
        date = date.toISOString().slice(0,10);
        data.dt_procured = date;

        res.render('game_copies/form', data);
    });
});

routes.post('/', [
    // validations from express-validator
    body('library_tag').trim()
        .isInt().withMessage('must contain numbers only'),
], (req, res) => {
    const errors = validationResult(req);

    const data = {
        page_title: req.body.page_title,
        game_title: req.body.game_title,
        game_platform: req.body.game_platform,
        release_id: req.body.release_id,
        library_tag: req.body.library_tag,
        dt_procured: req.body.dt_procured,
        redirect: req.body.redirect
    };

    const query = querystring.stringify(data);

    if (!errors.isEmpty()) {
        errors.array().forEach(error => {
            req.flash('danger', `${error.param} error: ${error.msg}`);
        });

        res.redirect(data.redirect + query);
    } else {
        // parameters for insert query
        const newCopy = {
            release_id  : req.body.release_id,
            library_tag: req.body.library_tag,
            dt_procured: req.body.dt_procured
        };

        GameCopy.create(newCopy, (err, copy) => {
            if (err) {
                req.flash('danger', `Oops! Tag #${newCopy.library_tag} is already in the library. Please choose a new tag.`);
                res.redirect(data.redirect + query);
            }

            else {
                req.flash('success', `Copy created: Tag #${newCopy.library_tag} ${data.game_title} on ${data.game_platform}!`);
                res.redirect('/game_copies/');
            }
        });
    }
});

routes.post('/update', [
    // validations from express-validator
    body('library_tag').trim()
        .isInt().withMessage('must contain numbers only'),
], (req, res) => {
    const errors = validationResult(req);

    const data = {
        page_title: req.body.page_title,
        game_title: req.body.game_title,
        game_platform: req.body.game_platform,
        release_id: req.body.release_id,
        copy_id: req.body.copy_id,
        library_tag: req.body.library_tag,
        dt_procured: req.body.dt_procured,
        redirect: req.body.redirect
    };

    const query = querystring.stringify(data);

    if (!errors.isEmpty()) {

        errors.array().forEach(error => {
            req.flash('danger', `${error.param} error: ${error.msg}`);
        });

        res.redirect(data.redirect + query);

    } else {

        // parameters for update query
        const newCopy = {
            library_tag: req.body.library_tag,
            dt_procured: req.body.dt_procured,
            id:          req.body.copy_id
        };

        GameCopy.update(newCopy, (err, copy) => {
            if (err) {
                req.flash('danger', `Oops! Tag #${newCopy.library_tag} is already in the library. Please choose a new tag.`);
                res.redirect(data.redirect + query);
            }

            else {
                req.flash('success', `Copy updated: Tag #${newCopy.library_tag} ${data.game_title} on ${data.game_platform}!`);
                res.redirect('/game_copies/');
            }
        });
    }
});

module.exports = routes;
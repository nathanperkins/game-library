const routes = require('express').Router();
const queries = require('../queries');
const querystring = require('querystring');

const GamePlatform = require('../models/game_platforms');
const GameRelease  = require('../models/game_releases');
const GameTitle    = require('../models/game_titles');

// express-validator used to validate and clean form data
// from https://express-validator.github.io/docs/
// uses validator.js
// from https://github.com/chriso/validator.js
const { body, validationResult } = require('express-validator/check');

routes.get('/', (req, res) => {
    const context = {
        page_title: "Game Release Index",
        table_name: "game_releases",
        pretty_name: "Game Release",
    }

    GameRelease.getAll({}, (err, releases) => {
        if (err) throw err;

        context.rows = releases;
        context.fields = [
            {name: "id",           pretty: 'ID'},
            {name: "title",        pretty: 'Title'},
            {name: "platform",     pretty: 'Platform'},
            {name: "release_date", pretty: 'Release Date'},
        ]

        releases.forEach(release => {
            if (release.release_date) release.release_date = release.release_date.toLocaleString("en-US", {year: "numeric", month: "numeric", day: "numeric", timeZone: "UTC"});
        });

        res.render('game_releases/index', context);
    });
});

routes.get('/new', (req, res) => {
    const data = { page_title: 'New Game Release'};

    if( !req.query.hasOwnProperty('title_id')) {
        req.flash('danger', `Error: need to provide a title_id`);
        res.redirect('/game_titles/');
        return;
    }

    GameTitle.get({id: req.query.title_id}, (err, title) => {
        if (!title) {
            req.flash('danger', `Error: title_id ${req.query.title_id} was not found`);
            res.redirect('/game_titles/');
            return;
        }
        if (err) {
            throw err;
        }
        GamePlatform.getAll({}, (err, platforms) => {
            if (err) throw err;

            data.platforms = platforms;
            data.release   = {
                title_id: title.id,
                title   : title.name,
            }

            res.render('game_releases/new', data);
        });
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
        title_id: req.body.title_id,
    };

    if (!errors.isEmpty()) {

        errors.array().forEach(error => {
            req.flash('danger', `${error.param} error: ${error.msg}`);
        });

        const query = querystring.stringify(data);
        res.redirect('/game_releases/new?' + query);

    } else {
        // parameters for insert query
        const newRelease = {
            title_id     : req.body.title_id,
            platform_id  : req.body.platform_id,
            rating       : req.body.rating       || null,
            boxart_url   : req.body.boxart_url   || null,
            release_date : req.body.release_date || null,
        }

        GameRelease.create(newRelease, (err) => {
            if (err) {
                req.flash('danger', `Game Release for title ${req.body.title_id}, platform ${req.body.platform_id} is already in the library.`);
                res.redirect('/game_titles/');
                return;
            }

            req.flash('success', `Release created: for title ${req.body.title_id}, platform ${req.body.platform_id}!`);
            res.redirect('/game_releases/');
            
        });
    }
});

module.exports = routes;
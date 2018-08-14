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
        page_description: "Here are the releases currently listed in the library. To add a new release, use the button below to be taken to the game titles table. Find the title for which you'd like to add a new release to the library, and click '+ New Release' at the end of the row.",
        table_name: "game_releases",
        pretty_name: "Game Release",
        new_endpoint: "/game_titles/",
        child_endpoint: "/game_copies/new",
        child_name: "Copy",
        id_name: "release_id",
        update: false,
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

        res.render('generic/table', context);
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
            rating       : req.body.rating,
            boxart_url   : req.body.boxart_url,
            release_date : req.body.release_date,
        }

        GameRelease.create(newRelease, (err, release) => {
            if (err && err.errno === 1062) {
                req.flash('danger', `Game Release creation failed: it is a duplicate title, platform combination.`);
                res.redirect(`/game_releases/new/?title_id=${newRelease.title_id}`);
                return;
            }
            if (err) {
                req.flash('danger', `Game Release creation failed: ${err.msg || err.sqlMessage}`);
                res.redirect(`/game_titles/`);
                return;
            }

            req.flash('success', `Release created: ${release.title} for ${release.platform}!`);
            res.redirect('/game_releases/');
            
        });
    }
});

module.exports = routes;
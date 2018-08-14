const routes = require('express').Router();
const queries = require('../queries');
const connection = require('../db');

const GameRequest = require('../models/game_requests');
const GameCopy = require('../models/game_copies');

routes.get('/', (req, res) => {
    const data = {
        page_title: 'Requests',
    };

    GameRequest.getAll({}, (err, rows, fields) => {
        if (err) throw err;

        data.rows = rows;
        res.render('game_requests/index', data);
    });
});


routes.get('/new/', (req, res) => {
    const data = {
        page_title  : 'Library',
        search      : null,
    };

    req.flash('success', `${req.query.game_title} requested!`);

    connection.query(queries.get_all_game_releases_with_search, ['%', '%'], (err, rows, fields) => {
        if (err) throw err;

        data.rows = rows;
        res.render('library/index', data);
    });
});

routes.get('/pending/', (req, res) => {
    const data = {
        page_title: 'Requests',
    };

    GameRequest.getAllByStatus("pending", (err, requests, fields) => {
        if (err) throw err;
        GameCopy.getAll({}, (err, copies, fields) => {
            if (err) throw err;

            requests.forEach(request => {
                request.copies = copies.filter(copy => copy.release_id === request.release_id);
            });

            data.rows = requests;
            res.render('game_requests/pending', data);
        });
    });
});

routes.get('/checked_out/', (req, res) => {
    const data = {
        page_title: 'Requests',
    };

    GameRequest.getAllByStatus("checked_out", (err, requests, fields) => {
        if (err) throw err;
        
        data.rows = requests;
        res.render('game_requests/checked_out', data);
    });
});

routes.get('/completed/', (req, res) => {
    const data = {
        page_title: 'Requests',
    };

    GameRequest.getAllByStatus("completed", (err, rows, fields) => {
        if (err) throw err;

        data.rows = rows;
        res.render('game_requests/completed', data);
    });
});

routes.post('/', (req, res) => {
    if (!req.session.user) {
        req.flash('warning', "Must login before making a requests");
        res.redirect('/users/login');
    }
    console.log("Creating Request: ", req.body);

    GameRequest.create(req.body, (err, request) => {
        if (err) throw err;

        req.flash('success', "Submitted request!");
        res.redirect(`/users/profile`);
    });
});

routes.delete('/:request_id', (req, res) => {
    console.log("attempted to delete: ", req.params.request_id);

    GameRequest.destroy({id: req.params.request_id}, (err, rows, fields) => {
        if (err) throw err;

        req.flash('success', `Request id(${req.params.request_id}) was deleted!`);
        res.redirect(req.body._redirect || '/game_requests/completed');
    });
})

routes.post('/:request_id/check_out', (req, res) => {
    console.log("attempting to check out: ", req.params.request_id);

    if (!req.body.copy_id) {
        req.flash("danger", "Needs a copy_id");
        res.redirect('/game_requests/pending');
        return;
    }

    GameRequest.update({id: req.params.request_id, copy_id: req.body.copy_id, dt_delivered: new Date()}, (err, request, fields) => {
        if (err) throw err;

        req.flash("success", `You checked out ${request.title} to ${request.user}`);
        res.redirect("/game_requests/checked_out");
    });
});

routes.post('/:request_id/check_in', (req, res) => {
    console.log("attempting to check in: ", req.params.request_id);

    GameRequest.update({id: req.params.request_id, dt_completed: new Date()}, (err, request, fields) => {
        if (err) throw err;

        req.flash("success", `You checked in ${request.title} from ${request.user}`);
        res.redirect("/game_requests/completed");
    });
});

module.exports = routes;
process.env.NODE_ENV = 'test';

const chai     = require('chai');
const chaiHttp = require('chai-http');
const should   = chai.should();

const app      = require('../../../app');
const db       = require(__basedir + '/db');

chai.use(chaiHttp);

const agent = chai.request.agent(app.get('base_url'));

describe('View - Create Game Copy', () => {

    beforeEach('reset db and add titles', done => {
        db.createTables( err => {
            if (err) throw err;
            db.insertDummyData( err => {
                if (err) throw err;
                done();
            });
        });
    });

    describe('GET /game_copies/new/ (bad requests)', () => {
        it('it should redirect without a release_id', done => {
            agent
                .get('/game_copies/new/')
                .end( (err, res) => {
                    res.should.redirect;
                    res.should.redirectTo(app.get('base_url') + '/game_releases/');
                    res.text.should.match(/did not find GameRelease/);
                    done();
                });
        });

        it('it should redirect with an invalid release_id', done => {
            agent
                .get('/game_copies/new/?release_id=-1')
                .end( (err, res) => {
                    res.should.redirect;
                    res.should.redirectTo(app.get('base_url') + '/game_releases/');
                    res.text.should.match(/did not find GameRelease/);
                    done();
                });
        });
    });

    describe('GET /game_copies/new/?release_id=:id', () => {
        it('it should respond with 200', done => {
            chai.request(app)
                .get('/game_copies/new/?release_id=3')
                .end( (err, res) => {
                    res.should.have.status(200);
                    done();
                });
        });

        it('it should have the new copy form', done => {
            chai.request(app)
                .get('/game_copies/new/?release_id=3')
                .end( (err, res) => {
                    res.text.should.match(/Add a new copy of/);
                    res.text.should.match(/Zelda/);
                    res.text.should.match(/Switch/);
                    res.text.should.match(/<form action="\/game_copies\/" method="POST">/);
                    res.text.should.match(/<input[\w\s"=-]* name="copy_id"/);
                    res.text.should.match(/<input[\w\s"=-]* name="release_id"/);
                    res.text.should.match(/<input[\w\s"=-]* name="library_tag"/);
                    res.text.should.match(/<input[\w\s"=-]* name="dt_procured"/);
                    res.text.should.match(/<button[\w\s"=-]*>Submit/);
                    res.text.should.match(/<button[\w\s"=-]*>Cancel/);
                    done();
                });
        });
    });
});
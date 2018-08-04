process.env.NODE_ENV = 'test';

const chai     = require('chai');
const chaiHttp = require('chai-http');
const should   = chai.should();

const app      = require('../../../app');
const db       = require(__basedir + '/db');

chai.use(chaiHttp);

describe('Page - Create Game Release', () => {

    before('reset db and add releases', done => {
        db.createTables( err => {
            if (err) throw err;
            db.insertDummyData( err => {
                if (err) throw err;
                done();
            });
        });
    });

    describe('GET /game_releases/new/?title_id=3', () => {
        
        it('it should respond with 200', done => {
            chai.request(app)
                .get('/game_releases/new/?title_id=1')
                .end( (err, res) => {
                    res.should.have.status(200);
                    done();
                });
        });

        it('it should have the new release form', done => {
            chai.request(app)
                .get('/game_releases/new/?title_id=1')
                .end( (err, res) => {
                    res.text.should.match(/Create a new game release/);
                    res.text.should.match(/<form action="\/game_releases\/" method="POST">/);
                    res.text.should.match(/Zelda/);
                    res.text.should.match(/<input[\w\s"=\.\-]* name="title_id"/);
                    res.text.should.match(/<select[\w\s"=\.\-]* name="platform_id"/);
                    res.text.should.match(/<input[\w\s"=\.\-]* name="release_date"/);
                    res.text.should.match(/<input[\w\s"=\.\-]* name="rating"/);
                    res.text.should.match(/<input[\w\s"=\.\-]* name="boxart_url"/);
                    res.text.should.match(/<button[\w\s"=\.\-]*>Submit/);
                    res.text.should.match(/<button[\w\s"=\.\-]*>Cancel/);
                    done();
                });
        });
    });

    describe('GET /game_releases/new/', () => {

        it('it should redirect if title_id is missing', done => {
            chai.request(app)
                .get('/game_releases/new/')
                .redirects(1)
                .end( (err, res) => {
                    // TODO: test flash message using a session
                    // res.text.should.match(/Error: need to provide a title_id/);
                    res.text.should.match(/Game Title Index/);
                    done();
                });
        });

    });

    describe('GET /game_releases/new/?title_id=-1', () => {
        it('it should redirect if title_id is invalid', done => {
            chai.request(app)
                .get('/game_releases/new/?title_id=-1')
                .redirects(1)
                .end( (err, res) => {
                    // TODO: test flash message using a session
                    // res.text.should.match(/Error: title_id -1 was not found/);
                    res.text.should.match(/Game Title Index/);
                    done();
                });
        });
    });
});
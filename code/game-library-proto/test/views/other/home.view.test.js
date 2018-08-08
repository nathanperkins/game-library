process.env.NODE_ENV = 'test';

const chai     = require('chai');
const chaiHttp = require('chai-http');
const should   = chai.should();

const app      = require('../../../app');
const db       = require(__basedir + '/db');
const User     = require(__basedir + '/models/users');

const test_data = JSON.parse(require('fs').readFileSync(__basedir + "/test/test_data.json"));
const user      = test_data['users']['1'];

chai.use(chaiHttp);
const agent = chai.request.agent(app.get('base_url'));

describe('View - Home', () => {

    beforeEach('reset database', done => {
        db.createTables( err => {
            if (err) throw err;
            User.create(user, (err, user) => {
                if (err) throw err;
                done();
            });
        });
    });

    describe('GET / without user', () => {
        it('it should respond with 200', done => {
            chai.request(app)
                .get('/')
                .end( (err, res) => {
                    res.should.have.status(200);
                    done();
                }
            );
        });

        it('it should have the navbar', done => {
            chai.request(app)
                .get('/')
                .end( (err, res) => {
                    res.text.should.match(/>[\s]*Game Library Test/);
                    res.text.should.match(/>[\s]*Library/);
                    res.text.should.match(/>[\s]*Login/);
                    res.text.should.match(/>[\s]*Register/);
                    res.text.should.not.match(/>[\s]*Admin/);
                    done();
                });
        });

        it('it should have the page content', done => {
            chai.request(app)
                .get('/')
                .end( (err, res) => {
                    res.text.should.match(/<h1[\w\s="]*>[\s]*Game Library/);
                    res.text.should.match(/<p[\w\s="]*>[\s]*Request your games/)
                    done();
                });
        });

        it('it should not have the admin menu', done => {
            chai.request(app)
                .get('/')
                .end( (err, res) => {
                    res.text.should.not.match(/>[ "\n]*Admin/);
                    done();
                });
        });
    });

    describe('GET / with user', () => {
        it('it should have logout', done => {
            agent
                .post('/users/login/')
                .type('form')
                .send(user)
                .end( (err, res) => {
                    if (err) throw err;
                    agent
                        .get('/')
                        .end( (err, res) => {
                            res.text.should.match(/Logout/);
                            res.text.should.match(/Promote/);
                            res.text.should.not.match(/Login/);
                            res.text.should.not.match(/Register/);
                            done();
                        });
                })
        });
    });

    describe('GET /nonsense/', () => {
        it('it should respond 404', done => {
            chai.request(app)
                .get('/nonsense/')
                .end( (err, res) => {
                    res.should.have.status(404);
                    res.text.should.match(/404 - Not Found/);
                    done();
                });
        });
    });
});
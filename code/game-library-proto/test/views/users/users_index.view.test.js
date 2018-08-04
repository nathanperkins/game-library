process.env.NODE_ENV = 'test';

const chai     = require('chai');
const chaiHttp = require('chai-http');
const should   = chai.should();

const app      = require('../../../app');
const db       = require(__basedir + '/db');

chai.use(chaiHttp);

describe('Page - Users index', () => {

    describe('GET /users/ without user', () => {

        before('reset database', done => {
            db.createTables( err => {
                if (err) throw err;
                done();
            });
        });

        it('it should respond with 200', done => {
            chai.request(app)
                .get('/users/')
                .end( (err, res) => {
                    res.should.have.status(200);
                    done();
                }
            );
        });

        it('it should have content', done => {
            chai.request(app)
                .get('/users/')
                .end( (err, res) => {
                    res.text.should.match(/Users Index/);
                    res.text.should.match(/New User/);
                    done();
                }
            );
        });

        it('it should not have a table', done => {
            chai.request(app)
                .get('/users/')
                .end( (err, res) => {
                    res.text.should.not.match(/<table/);
                    res.text.should.match(/No Users/);
                    done();
                }
            );
        });

    });

    describe('GET /users/ with user', () => {

        before('reset db and add users', done => {
            db.createTables( err => {
                if (err) throw err;
                db.insertDummyData( err => {
                    if (err) throw err;
                    done();
                });
            });
        });

        it('it should have content', done => {
            chai.request(app)
                .get('/users/')
                .end( (err, res) => {
                    res.text.should.match(/Users Index/);
                    res.text.should.match(/New User/);
                    done();
                }
            );
        });

        it('it should have a table', done => {
            chai.request(app)
                .get('/users/')
                .end( (err, res) => {
                    res.text.should.match(/ID/);
                    res.text.should.match(/Last Name/);
                    res.text.should.match(/First Name/);
                    res.text.should.match(/Email/);
                    res.text.should.match(/Role/);

                    res.text.should.match(/61/);
                    res.text.should.match(/Abshire/);
                    res.text.should.match(/George/);
                    res.text.should.match(/george.abshire@walshmorissetteandkihn.com/);
                    res.text.should.match(/user/);
                    done();
                }
            );
        });

    });
});
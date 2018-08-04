process.env.NODE_ENV = 'test';

const chai     = require('chai');
const chaiHttp = require('chai-http');
const should   = chai.should();

const app      = require('../../../app');
const db       = require(__basedir + '/db');

chai.use(chaiHttp);

describe('View - Library', () => {

    describe('Library without data', () => {

        before('reset database', done => {
            db.createTables( err => {
                if (err) throw err;
                done();
            });
        });

        describe('GET /library/', () => {

            it('it should respond with 200', done => {
                chai.request(app)
                    .get('/library/')
                    .end( (err, res) => {
                        res.should.have.status(200);
                        done();
                    }
                );
            });

            it('it should have a search form', done => {
                chai.request(app)
                    .get('/library')
                    .end( (err, res) => {
                        res.text.should.match(/<form action="\/library\/"/);
                        res.text.should.match(/Search/);
                        done();
                    });
            });

            it('it should not have a table', done => {
                chai.request(app)
                    .get('/library')
                    .end( (err, res) => {
                        res.text.should.not.match(/<article class="media">/);
                        res.text.should.match(/No games/);
                        done();
                    });
            });
            
        });
    });

    describe('Library with data', () => {
        before('reset database and insert dummy data', done => {
            db.createTables( err => {
                if (err) throw err;
                db.insertDummyData( err => {
                    if (err) throw err;
                    done();
                });
            });
        });

        describe('GET /library/', () => {

            it('it should respond with 200', done => {
                chai.request(app)
                    .get('/library/')
                    .end( (err, res) => {
                        res.should.have.status(200);
                        done();
                    });
            });

            it('it should have a table', done => {
                chai.request(app)
                    .get('/library')
                    .end( (err, res) => {
                        res.text.should.match(/<article class="media">/);
                        res.text.should.match(/The Legend of Zelda: Breath of the Wild/);
                        res.text.should.match(/Forget everything you know/);
                        res.text.should.match(/Wii U/);
                        res.text.should.not.match(/No games/);
                        done();
                    });
            });

        });
    });
});
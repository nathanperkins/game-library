process.env.NODE_ENV = 'test';

const chai     = require('chai');
const chaiHttp = require('chai-http');
const should   = chai.should();

const app      = require('../../../app');
const db       = require(__basedir + '/db');

chai.use(chaiHttp);

describe('View - Game Copy Index', () => {

    describe('GET /game_copies/ without copy', () => {

        before('reset database', done => {
            db.createTables( err => {
                if (err) throw err;
                done();
            });
        });

        it('it should respond with 200', done => {
            chai.request(app)
                .get('/game_copies/')
                .end( (err, res) => {
                    res.should.have.status(200);
                    done();
                }
            );
        });

        it('it should have content', done => {
            chai.request(app)
                .get('/game_copies/')
                .end( (err, res) => {
                    res.text.should.match(/Game Copy Index/);
                    res.text.should.match(/To add a new game copy/);
                    res.text.should.match(/href="\/game_releases\//);
                    res.text.should.match(/New Game Copy/);
                    done();
                }
            );
        });

        it('it should not have a table', done => {
            chai.request(app)
                .get('/game_copies/')
                .end( (err, res) => {
                    res.text.should.not.match(/<table/);
                    res.text.should.match(/No data/);
                    done();
                }
            );
        });

    });

    describe('GET /game_copies/ with copy', () => {

        before('reset db and add copies', done => {
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
                .get('/game_copies/')
                .end( (err, res) => {
                    res.text.should.match(/Game Copy Index/);
                    res.text.should.match(/New Game Copy/);
                    done();
                }
            );
        });

        it('it should have a table', done => {
            chai.request(app)
                .get('/game_copies/')
                .end( (err, res) => {
                    res.text.should.match(/ID/);
                    res.text.should.match(/Status/);
                    res.text.should.match(/Title/);
                    res.text.should.match(/Platform/);
                    res.text.should.match(/Library Tag/);
                    res.text.should.match(/Update/);
                    res.text.should.not.match(/Add Child/);

                    res.text.should.match(/4/);
                    res.text.should.match(/The Legend of Zelda/);
                    res.text.should.match(/Switch/);
                    res.text.should.match(/available/);
                    done();
                }
            );
        });

    });
});
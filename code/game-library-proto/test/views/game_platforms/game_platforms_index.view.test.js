process.env.NODE_ENV = 'test';

const chai     = require('chai');
const chaiHttp = require('chai-http');
const should   = chai.should();

const app      = require('../../../app');
const db       = require(__basedir + '/db');

chai.use(chaiHttp);

describe('Page - Game Platform Index', () => {

    describe('GET /game_platforms/ without title', () => {

        before('reset database', done => {
            db.createTables( err => {
                if (err) throw err;
                done();
            });
        });

        it('it should respond with 200', done => {
            chai.request(app)
                .get('/game_platforms/')
                .end( (err, res) => {
                    res.should.have.status(200);
                    done();
                }
            );
        });

        it('it should have content', done => {
            chai.request(app)
                .get('/game_platforms/')
                .end( (err, res) => {
                    res.text.should.match(/Game Platform Index/);
                    res.text.should.match(/New Game Platform/);
                    done();
                }
            );
        });

        it('it should not have a table', done => {
            chai.request(app)
                .get('/game_platforms/')
                .end( (err, res) => {
                    res.text.should.not.match(/<table/);
                    res.text.should.match(/No Game Platforms/);
                    done();
                }
            );
        });

    });

    describe('GET /game_platforms/ with title', () => {

        before('reset db and add titles', done => {
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
                .get('/game_platforms/')
                .end( (err, res) => {
                    res.text.should.match(/Game Platform Index/);
                    res.text.should.match(/New Game Platform/);
                    done();
                }
            );
        });

        it('it should have a table', done => {
            chai.request(app)
                .get('/game_platforms/')
                .end( (err, res) => {
                    res.text.should.match(/ID/);
                    res.text.should.match(/Manufacturer/);
                    res.text.should.match(/Release Date/);
                    res.text.should.not.match(/Created/);
                    res.text.should.not.match(/Updated/);

                    res.text.should.match(/1/);
                    res.text.should.match(/Switch/);
                    res.text.should.match(/Nintendo/);
                    res.text.should.match(/3\/3\/2017/);
                    done();
                }
            );
        });

    });
});
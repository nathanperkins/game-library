process.env.NODE_ENV = 'test';

const chai     = require('chai');
const chaiHttp = require('chai-http');
const should   = chai.should();

const app      = require('../../../app');
const db       = require(__basedir + '/db');

chai.use(chaiHttp);

describe('View - Game Title Index', () => {

    describe('GET /game_titles/ without title', () => {

        before('reset database', done => {
            db.createTables( err => {
                if (err) throw err;
                done();
            });
        });

        it('it should respond with 200', done => {
            chai.request(app)
                .get('/game_titles/')
                .end( (err, res) => {
                    res.should.have.status(200);
                    done();
                }
            );
        });

        it('it should have content', done => {
            chai.request(app)
                .get('/game_titles/')
                .end( (err, res) => {
                    res.text.should.match(/Game Title Index/);
                    res.text.should.match(/New Game Title/);
                    res.text.should.match(/href="\/game_titles\/new\//);
                    res.text.should.match(/Title description here/);
                    done();
                }
            );
        });

        it('it should not have a table', done => {
            chai.request(app)
                .get('/game_titles/')
                .end( (err, res) => {
                    res.text.should.not.match(/<table/);
                    res.text.should.match(/No data/);
                    done();
                }
            );
        });

    });

    describe('GET /game_titles/ with title', () => {

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
                .get('/game_titles/')
                .end( (err, res) => {
                    res.text.should.match(/Game Title Index/);
                    res.text.should.match(/New Game Title/);
                    res.text.should.match(/href="\/game_titles\/new\//);
                    res.text.should.match(/Title description here/);
                    done();
                }
            );
        });

        it('it should have a table', done => {
            chai.request(app)
                .get('/game_titles/')
                .end( (err, res) => {
                    res.text.should.match(/ID/);
                    res.text.should.match(/Name/);
                    res.text.should.not.match(/Description/);
                    res.text.should.match(/Genre/);
                    res.text.should.match(/Developer/);
                    res.text.should.match(/Producer/);
                    res.text.should.match(/Update/);
                    res.text.should.match(/Add Release/);

                    res.text.should.match(/1/);
                    res.text.should.match(/The Legend of Zelda/);
                    res.text.should.match(/Action/);
                    res.text.should.match(/Nintendo/);
                    res.text.should.match(/action="\/game_releases\/new/);
                    res.text.should.match(/name="title_id" value="3"/);
                    done();
                }
            );
        });

    });
});
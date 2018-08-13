process.env.NODE_ENV = 'test';

const chai     = require('chai');
const chaiHttp = require('chai-http');
const should   = chai.should();

const app      = require('../../../app');
const db       = require(__basedir + '/db');

chai.use(chaiHttp);

describe('View - Game Release Index', () => {

    describe('GET /game_releases/ without release', () => {

        before('reset database', done => {
            db.createTables( err => {
                if (err) throw err;
                done();
            });
        });

        it('it should respond with 200', done => {
            chai.request(app)
                .get('/game_releases/')
                .end( (err, res) => {
                    res.should.have.status(200);
                    done();
                }
            );
        });

        it('it should have content', done => {
            chai.request(app)
                .get('/game_releases/')
                .end( (err, res) => {
                    res.text.should.match(/Game Release Index/);
                    res.text.should.match(/New Game Release/);
                    res.text.should.match(/href="\/game_titles\//);
                    res.text.should.match(/Release description here/);
                    done();
                }
            );
        });

        it('it should not have a table', done => {
            chai.request(app)
                .get('/game_releases/')
                .end( (err, res) => {
                    res.text.should.not.match(/<table/);
                    res.text.should.match(/No data/);
                    done();
                }
            );
        });

    });

    describe('GET /game_releases/ with release', () => {

        before('reset db and add releases', done => {
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
                .get('/game_releases/')
                .end( (err, res) => {
                    res.text.should.match(/Game Release Index/);
                    res.text.should.match(/New Game Release/);
                    res.text.should.match(/href="\/game_titles\//);
                    res.text.should.match(/Release description here/);
                    done();
                }
            );
        });

        it('it should have a table', done => {
            chai.request(app)
                .get('/game_releases/')
                .end( (err, res) => {
                    res.text.should.match(/ID/);
                    res.text.should.match(/Title/);
                    res.text.should.match(/Platform/);
                    res.text.should.match(/Release Date/);
                    res.text.should.match(/>Update</);
                    res.text.should.match(/Add Copy/);
                    res.text.should.not.match(/boxart_url/);
                    res.text.should.not.match(/rating/);

                    res.text.should.match(/3/);
                    res.text.should.match(/The Legend of Zelda: Breath of the Wild/);
                    res.text.should.match(/Switch/);
                    res.text.should.match(/3\/3\/2017/);
                    res.text.should.match(/action="\/game_copies\/new/);
                    res.text.should.match(/name="release_id" value="10"/);
                    done();
                }
            );
        });

    });
});
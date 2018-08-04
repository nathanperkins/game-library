process.env.NODE_ENV = 'test';

const chai     = require('chai');
const chaiHttp = require('chai-http');
const should   = chai.should();

const app          = require('../../../app');
const db           = require(__basedir + '/db');
const GameTitle    = require(__basedir + '/models/game_titles');
const GamePlatform = require(__basedir + '/models/game_platforms');
const GameRelease  = require(__basedir + '/models/game_releases');

const test_data = JSON.parse(require('fs').readFileSync(__basedir + "/test/test_data.json"));
const title     = test_data['titles']['1'];
const platform  = test_data['platforms']['1'];
const release   = test_data['releases']['1'];

chai.use(chaiHttp);
const agent = chai.request.agent(app.get('base_url'));

describe('Route - POST /game_releases/', () => {

    beforeEach('reset database', done => {
        db.createTables( err => {
            if (err) throw err;
            GameTitle.create(title, (err, title) => {
                if (err) throw err;
                GamePlatform.create(platform, (err, platform) => {
                    if (err) throw err;
                    done();
                });
            })
        });
    });

    afterEach('reset cookies', done => {
        agent.set('Cookie', []);
        done();
    });

    it('it should redirect to /game_releases/ on success with msg', done => {
        agent
            .post('/game_releases/')
            .type('form')
            .send(release)
            .end( (err, res) => {
                res.should.redirect;
                res.should.redirectTo(`${app.get('base_url')}/game_releases/`);
                res.should.have.status(200);
                
                res.text.should.match(/Release created: /);
                res.text.should.match(/Legend of Zelda for Switch/);
                done();
            });
    });

    it('it should redirect to /game_releases/new/ on duplicate', done => {
        GameRelease.create(release, (err, new_release) => {
            agent
                .post('/game_releases/')
                .type('form')
                .send(release)
                .end( (err, res) => {
                    res.should.redirect;
                    res.should.redirectTo(`${app.get('base_url')}/game_releases/new/?title_id=1`);
                    res.should.have.status(200);
                    
                    res.text.should.match(/Game Release creation failed: it is a duplicate title, platform combination/);
                    done();
                });
        });
    });

    it('it should redirect to /game_releases/new/ on failure', done => {
        const invalid_release = Object.assign({}, release);
        delete invalid_release.title_id;

        agent
            .set('Cookie', [])
            .post('/game_releases/')
            .type('form')
            .send(invalid_release)
            .end( (err, res) => {
                res.should.redirect;
                res.should.redirectTo(`${app.get('base_url')}/game_titles/`);
                res.should.have.status(200);
                
                res.text.should.match(/Game Release creation failed./);
                res.text.should.match(/cannot be null/);
                res.text.should.not.match(/duplicate/);
                done();
            });
        });
});
process.env.NODE_ENV = 'test';

const chai     = require('chai');
const chaiHttp = require('chai-http');
const should   = chai.should();

const app          = require('../../../app');
const db           = require(__basedir + '/db');
const User         = require(__basedir + '/models/users');

const test_data = JSON.parse(require('fs').readFileSync(__basedir + "/test/test_data.json"));
const user      = test_data['users']['1'];

chai.use(chaiHttp);
const agent = chai.request.agent(app.get('base_url'));

describe('Route - POST /users/login/', () => {

    before('reset database', done => {
        db.createTables( err => {
            if (err) throw err;
            done();
        });
    });

    it('it should log the user in', done => {
        agent
            .post('/users/')
            .type('form')
            .send(user)
            .end( (err, res) => {
                res.should.redirect;
                res.should.redirectTo(`${app.get('base_url')}/`);
                res.should.have.status(200);
                
                res.text.should.match(/Welcome/);
                res.text.should.match(/logout/);
                done();
            });
    })
});
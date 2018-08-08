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
            User.create(user, (err, user) => {
                if (err) throw err;
                done();
            })
        });
    });

    describe('Invalid email', () => {
        it('it should give an error', done => {
            const credentials = {email: "bademail@gmail.com", password: user.password};
            agent
                .post('/users/login/')
                .type('form')
                .send(credentials)
                .end( (err, res) => {
                    res.should.redirect;
                    res.should.redirectTo(`${app.get('base_url')}/users/login/`);
                    res.should.have.status(200);
                    
                    res.text.should.match(/Login error/);
                    res.text.should.match(/username or password/);
                    done();
                });
        });
    });

    describe('Invalid password', () => {
        it('it should give an error', done => {
            const credentials = {email: user.email, password: "bad_password"};
            agent
                .post('/users/login/')
                .type('form')
                .send(credentials)
                .end( (err, res) => {
                    res.should.redirect;
                    res.should.redirectTo(`${app.get('base_url')}/users/login/`);
                    res.should.have.status(200);
                    
                    res.text.should.match(/Login error/);
                    res.text.should.match(/username or password/);
                    done();
                });
        });
    });

    describe('Valid credentials', () => {
        it('it should work', done => {
            const credentials = {email: user.email, password: user.password};
            agent
                .post('/users/login/')
                .type('form')
                .send(credentials)
                .end( (err, res) => {
                    res.should.redirect;
                    res.should.redirectTo(`${app.get('base_url')}/`);
                    res.should.have.status(200);
                    
                    res.text.should.match(/Logout/);
                    res.text.should.match(/Welcome/);
                    res.text.should.match(new RegExp(user.first_name, 'g'));
                    done();
                });
        });
    });
});
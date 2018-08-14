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

describe('Route - GET /users/:id/promote/', () => {

    before('reset database', done => {
        db.createTables( err => {
            if (err) throw err;
            User.create(user, (err, user) => {
                if (err) throw err;
                done();
            })
        });
    });

    describe('Promote user', () => {
        it('it should have a normal user to start', done => {
            User.get({id: 1}, (err, user) => {
                user.role.should.equal('user');
                done();
            });
        });

        it('it should promote the user', done => {
            const credentials = {email: user.email, password: user.password};
            agent
                .get('/users/1/promote/')
                .end( (err, res) => {
                    res.should.redirect;
                    res.should.redirectTo(`${app.get('base_url')}/`);
                    res.should.have.status(200);
                    
                    res.text.should.match(new RegExp(user.email, 'g'));
                    res.text.should.match(/was promoted to admin/);
                    res.text.should.match(/Admin/);
                    res.text.should.not.match(/Promote/);

                    User.get({email: user.email}, (err, user) => {
                        user.role.should.equal('admin');
                        done();
                    });
                });
        });
    });
});
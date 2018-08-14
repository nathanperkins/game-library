process.env.NODE_ENV = 'test';

const chai     = require('chai');
const chaiHttp = require('chai-http');
const should   = chai.should();

const app      = require('../../../app');

chai.use(chaiHttp);

describe('View - Register', () => {
    describe('GET /users/new/', () => {
        
        it('it should respond with 200', done => {
            chai.request(app)
                .get('/users/new/')
                .end( (err, res) => {
                    res.should.have.status(200);
                    done();
                });
        });

        it('it should have the registration form', done => {
            chai.request(app)
                .get('/users/new/')
                .end( (err, res) => {
                    res.text.should.match(/Registration/);
                    res.text.should.match(/<form action="\/users\/" method="POST">/);
                    res.text.should.match(/<input[\w\s"=-]* name="first_name"/);
                    res.text.should.match(/<input[\w\s"=-]* name="last_name"/);
                    res.text.should.match(/<input[\w\s"=-]* name="email"/);
                    res.text.should.match(/<input[\w\s"=-]* name="password"/);
                    res.text.should.match(/<button[\w\s"=-]*>Submit/);
                    res.text.should.match(/<button[\w\s"=-]*>Cancel/);
                    done();
                });
        });

    });
});
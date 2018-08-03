process.env.NODE_ENV = 'test';

const chai     = require('chai');
const chaiHttp = require('chai-http');
const app      = require('../app');
const should   = chai.should();

chai.use(chaiHttp);

describe('Login', () => {
    describe('GET /users/login/', () => {
        
        it('it should respond with 200', done => {
            chai.request(app)
                .get('/users/login/')
                .end( (err, res) => {
                    res.should.have.status(200);
                    done();
                });
        });

        it('it should have the login form', done => {
            chai.request(app)
                .get('/users/login/')
                .end( (err, res) => {
                    res.text.should.match(/Login/);
                    res.text.should.match(/<form action="\/users\/login\/" method="POST">/)
                    res.text.should.match(/<input[\w\s"=-]* name="email"/);
                    res.text.should.match(/<input[\w\s"=-]* name="password"/);
                    res.text.should.match(/<button[\w\s"=-]*>Login/);
                    done();
                });
        });

    });
});
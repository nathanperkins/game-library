process.env.NODE_ENV = 'test';

const chai     = require('chai');
const chaiHttp = require('chai-http');
const should   = chai.should();

const app      = require('../../../app');

chai.use(chaiHttp);

describe('View - Create Game Platform', () => {
    describe('GET /game_platforms/new/', () => {
        
        it('it should respond with 200', done => {
            chai.request(app)
                .get('/game_platforms/new/')
                .end( (err, res) => {
                    res.should.have.status(200);
                    done();
                });
        });

        it('it should have the new platform form', done => {
            chai.request(app)
                .get('/game_platforms/new/')
                .end( (err, res) => {
                    res.text.should.match(/Create a new platform/);
                    res.text.should.match(/<form action="\/game_platforms\/" method="POST">/);
                    res.text.should.match(/<input[\w\s"=-]* name="name"/);
                    res.text.should.match(/<input[\w\s"=-]* name="manufacturer"/);
                    res.text.should.match(/<input[\w\s"=-]* name="release_date"/);
                    res.text.should.match(/<button[\w\s"=-]*>Submit/);
                    res.text.should.match(/<button[\w\s"=-]*>Cancel/);
                    done();
                });
        });

    });
});
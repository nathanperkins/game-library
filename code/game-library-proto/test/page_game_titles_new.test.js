process.env.NODE_ENV = 'test';

const chai     = require('chai');
const chaiHttp = require('chai-http');
const should   = chai.should();

const app      = require('../app');

chai.use(chaiHttp);

describe('Page - Create Game Title', () => {
    describe('GET /game_titles/new/', () => {
        
        it('it should respond with 200', done => {
            chai.request(app)
                .get('/game_titles/new/')
                .end( (err, res) => {
                    res.should.have.status(200);
                    done();
                });
        });

        it('it should have the new title form', done => {
            chai.request(app)
                .get('/game_titles/new/')
                .end( (err, res) => {
                    res.text.should.match(/Create a new title/);
                    res.text.should.match(/<form action="\/game_titles\/" method="POST">/);
                    res.text.should.match(/<input[\w\s"=-]* name="name"/);
                    res.text.should.match(/<textarea[\w\s"=-]* name="description"/);
                    res.text.should.match(/<select[\w\s"=-]* name="genre"/);
                    res.text.should.match(/<input[\w\s"=-]* name="developer"/);
                    res.text.should.match(/<input[\w\s"=-]* name="producer"/);
                    res.text.should.match(/<option[\w\s"=-]*>Action/);
                    res.text.should.match(/<button[\w\s"=-]*>Submit/);
                    res.text.should.match(/<button[\w\s"=-]*>Cancel/);
                    done();
                });
        });

    });
});
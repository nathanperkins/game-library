process.env.NODE_ENV = 'test';

const chai     = require('chai');
const chaiHttp = require('chai-http');
const should   = chai.should();

const app      = require('../../../app');

chai.use(chaiHttp);

describe('View - Admin', () => {
    describe('GET /admin/', () => {
        
        it('it should respond with 200', done => {
            chai.request(app)
                .get('/admin/')
                .end( (err, res) => {
                    res.should.have.status(200);
                    done();
                });
        });

        it('it should have the links', done => {
            chai.request(app)
                .get('/admin/')
                .end( (err, res) => {
                    res.text.should.match(/Game Library Test - Admin/);
                    res.text.should.match(/href="\/users\/"/);
                    res.text.should.match(/href="\/game_titles\/"/);
                    res.text.should.match(/href="\/game_platforms\/"/);
                    res.text.should.match(/href="\/game_releases\/"/);
                    res.text.should.match(/href="\/game_copies\/"/);
                    res.text.should.match(/href="\/game_requests\/pending\/"/);
                    res.text.should.match(/href="\/game_requests\/checked_out\/"/);
                    res.text.should.match(/href="\/game_requests\/completed\/"/);
                    done();
                });
        });

    });
});
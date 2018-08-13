process.env.NODE_ENV = 'test';

const chai     = require('chai');
const should   = chai.should();

const app          = require('../../app');
const db           = require(__basedir + '/db');

const GameRequest  = require(__basedir + '/models/game_requests');
const GameRelease  = require(__basedir + '/models/game_releases');
const GameTitle    = require(__basedir + '/models/game_titles');
const GamePlatform = require(__basedir + '/models/game_platforms');
const User         = require(__basedir + '/models/users');

const test_data        = JSON.parse(require('fs').readFileSync(__basedir + "/test/test_data.json"));
const generic_user     = test_data['users']['1'];
const generic_request  = test_data['requests']['1'];
const generic_release  = test_data['releases']['1'];
const generic_title    = test_data['titles']['1'];
const generic_platform = test_data['platforms']['1'];

function addDepencencies(callback) {
    GameTitle.create(generic_title, err => {
        if (err) throw err;
        GamePlatform.create(generic_platform, err => {
            if (err) throw err;
            GameRelease.create(generic_release, err => {
                if (err) throw err;
                User.create(generic_user, err => {
                    if (err) throw err;
                    callback();
                })
            });
        });
    });
}

describe('Model - GameRequest', () => {

    describe('GameRequest.get()', () => {

        beforeEach('reset database and add dummy data', done => {
            db.createTables( err => {
                if (err) throw err;
                db.insertDummyData( err => {
                    if (err) throw err;
                    done();
                });
            });
        });

        describe('GameRequest.get({id}, callback)', () => {

            it('it should give an error if invalid id', done => {
                GameRequest.get({id: -1}, (err, request) => {
                    err.should.be.an.instanceOf(Error);
                    should.not.exist(request);
                    done();
                });
            });

            it('it should return a request with valid id', done => {
                GameRequest.get({id: 2}, (err, request) => {
                    should.equal(err, null);
                    should.exist(request);

                    request.user_id.should.equal(58);
                    request.release_id.should.equal(9);
                    request.copy_id.should.equal(7)
                    // request.dt_requested.should.equal(new Date("2018-07-10"));
                    // request.dt_delivered.should.equal(new Date("2018-07-15"));
                    should.equal(request.dt_completed, null);
                    done();
                });
            });

            it('it should confirm the date');

        });
    });

    describe('GameRequest.getAll()', () => {
        describe('GameRequest.getAll({}, callback) with no requests', () => {

            beforeEach('reset database', done => {
                db.createTables( err => {
                    if (err) throw err;
                    done();
                });
            });

            it('it should return an empty array', done => {
                GameRequest.getAll({}, (err, requests) => {
                    should.equal(err, null);
                    should.exist(requests);
                    requests.length.should.equal(0);
                    done();
                });
            });
        });

        describe('GameRequest.getAll({}, callback) with requests', () => {
            beforeEach('reset database and add dummy data', done => {
                db.createTables( err => {
                    if (err) throw err;
                    db.insertDummyData( err => {
                        if (err) throw err;
                        done();
                    });
                });
            });

            it('it should return multiple requests', done => {
                GameRequest.getAll({}, (err, requests) => {
                    should.equal(err, null);
                    should.exist(requests);
                    requests.length.should.above(1);

                    const request = requests[2];

                    request.user_id.should.equal(59);
                    request.release_id.should.equal(9);
                    request.copy_id.should.equal(7)
                    request.dt_requested.should.exist;
                    request.dt_delivered.should.exist;
                    request.dt_completed.should.exist;
                    // request.dt_requested.should.equal(new Date("2018-07-09"));
                    // request.dt_delivered.should.equal(new Date("2018-07-10"));
                    // request.dt_completed.should.equal(new Date("2018-07-14"));
                    done();
                });
            });

            it('it should check the date');
        });
    });

    describe('GameRequest.create()', () => {

        beforeEach('reset database and add dummy data', done => {
            db.createTables( err => {
                if (err) throw err;
                addDepencencies( (err) => {
                    if (err) throw err;
                    done();
                });
            });
        });

        describe('GameRequest.create({params}, callback)', () => {
            it('it should not start with a GameRequest', done => {
                GameRequest.getAll({}, (err, requests) => {
                    if (err) throw err;
                    requests.length.should.equal(0);
                    done();
                });
            });

            it('it should create a GameRequest', done => {
                GameRequest.create(generic_request, (err, request) => {
                    should.equal(err, null);
                    request.should.exist;
                    
                    request.user_id.should.equal(generic_request.user_id);
                    request.release_id.should.equal(generic_request.release_id);
                    should.equal(request.copy_id, null);
                    request.dt_requested.should.exist;
                    should.equal(request.dt_delivered, null);
                    should.equal(request.dt_completed, null);
                    done();
                });
            });

            it('it should check the date too');

            it('it should give an error if missing params', done => {
                const incomplete_request = Object.assign({}, generic_request);
                delete incomplete_request.release_id;

                GameRequest.create(incomplete_request, (err, request) => {
                    err.should.be.an.instanceOf(Error);
                    should.not.exist(request);
                    done();
                });
            });

            it('it should not give an error if trying to create a duplicate', done => {
                GameRequest.create(generic_request, (err, request) => {
                    should.equal(err, null);
                    request.should.exist;

                    GameRequest.create(generic_request, (err, request) => {
                        should.equal(err, null);
                        request.should.exist;
                        done();
                    });
                });
            });
        });
    });

    describe('GameRequest.update()', () => {

        beforeEach('reset database', done => {
            db.createTables( err => {
                if (err) throw err;
                addDepencencies(() => {
                    GameRequest.create(generic_request, err => {
                        if (err) throw err;
                        done();
                    });
                    
                });
            });
        });

        describe('GameRequest.update({id}, callback)', () => {
            it('it should not modify the request', done => {
                GameRequest.update({id: 1}, (err, request) => {
                    should.equal(err, null);
                    request.should.exist;

                    request.user_id.should.equal(generic_request.user_id);
                    request.release_id.should.equal(generic_request.release_id);
                    request.dt_requested.should.exist;

                    should.not.exist(request.copy_id);
                    should.not.exist(request.dt_delivered);
                    should.not.exist(request.dt_completed);
                    done();
                });
            });

            it('it should check the date too');
        });


        describe('GameRequest.update({bad_id}, callback)', () => {
            it('it should give an error', done => {
                GameRequest.update({id: -1}, (err, request) => {
                    err.should.be.an.instanceOf(Error);
                    should.not.exist(request);
                    done();
                });
            });
        });

        describe('GameRequest.update({id, params}, callback)', () => {
            it('it should modify the request', done => {
                const updated_request = {
                    id: 1,
                    dt_delivered: new Date("2018-08-11"),
                }

                GameRequest.update(updated_request, (err, request) => {
                    should.equal(err, null);
                    request.should.exist;

                    request.user_id.should.equal(generic_request.user_id);
                    request.release_id.should.equal(generic_request.release_id);
                    request.dt_requested.should.exist;
                    request.dt_delivered.should.exist;

                    should.not.exist(request.copy_id);
                    should.not.exist(request.dt_completed);
                    done();
                });

                it('it should check the date too');
            });
        });
    });

    describe('GameRequest.destroy()', () => {

        beforeEach('reset database', done => {
            db.createTables( err => {
                if (err) throw err;
                addDepencencies(() => {
                    GameRequest.create(generic_request, (err) => {
                        if (err) throw err;
                        done();
                    });
                })
            });
        });

        describe('GameRequest.destroy({}, callback', () => {

            it('it should give an error without id', done => {
                GameRequest.destroy({}, (err, result) => {
                    err.should.be.an.instanceOf(Error);
                    should.not.exist(result);

                    GameRequest.getAll( {}, (err, requests) => {
                        should.equal(err, null);
                        requests.length.should.equal(1);
                        done();
                    });
                }); 
            });
        });

        describe('GameRequest.destroy({id}, callback)', () => {

            it('it should destroy a request with valid id', done => {
                GameRequest.get({id: 1}, (err, request) => {
                    should.equal(err, null);
                    request.should.not.be.empty;
                    request.id.should.equal(1);

                    GameRequest.destroy({id: 1}, (err, result) => {
                        should.equal(err, null);
                        result.should.not.be.empty;

                        GameRequest.getAll( {}, (err, requests) => {
                            should.equal(err, null);
                            requests.should.be.empty;
                            done();
                        });
                    });
                    
                });
            });

            it('it should give an error with invalid id', done => {
                GameRequest.destroy({id: -1}, (err, result) => {
                    err.should.be.an.instanceOf(Error);
                    should.not.exist(result);

                    GameRequest.getAll( {}, (err, requests) => {
                        should.equal(err, null);
                        requests.length.should.equal(1);
                        done();
                    });
                }); 
            });

        });
    });
});

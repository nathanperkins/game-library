process.env.NODE_ENV = 'test';

const chai     = require('chai');
const should   = chai.should();

const app          = require('../../app');
const db           = require(__basedir + '/db');
const GameCopy     = require(__basedir + '/models/game_copies');
const GamePlatform = require(__basedir + '/models/game_platforms');
const GameRelease  = require(__basedir + '/models/game_releases');
const GameTitle    = require(__basedir + '/models/game_titles');

const test_data        = JSON.parse(require('fs').readFileSync(__basedir + "/test/test_data.json"));
const generic_copy     = test_data['copies']['1'];
const generic_platform = test_data['platforms']['1'];
const generic_title    = test_data['titles']['1'];
const generic_release  = test_data['releases']['1'];

function addDepencencies(callback) {
    GameTitle.create(generic_title, err => {
        if (err) throw err;
        GamePlatform.create(generic_platform, err => {
            if (err) throw err;
            GameRelease.create(generic_release, err => {
                if (err) throw err;
                callback();
            });
        });
    });
}

describe('Model - GameCopy', () => {

    describe('GameCopy.get()', () => {

        beforeEach('reset database and add dummy data', done => {
            db.createTables( err => {
                if (err) throw err;
                db.insertDummyData( err => {
                    if (err) throw err;
                    done();
                });
            });
        });

        describe('GameCopy.get({id}, callback)', () => {

            it('it should give an error if invalid id', done => {
                GameCopy.get({id: -1}, (err, copy) => {
                    err.should.be.an.instanceOf(Error);
                    should.not.exist(copy);
                    done();
                });
            });

            it('it should return a copy with valid id', done => {
                GameCopy.get({id: 4}, (err, copy) => {
                    should.equal(err, null);
                    should.exist(copy);

                    copy.release_id.should.equal(3);
                    copy.library_tag.should.equal("00001");
                    copy.dt_procured.toISOString().slice(0,10).should.equal("2018-07-01");
                    copy.status.should.equal("available");
                    done();
                });
            });

        });
    });

    describe('GameCopy.getAll()', () => {
        describe('GameCopy.getAll({}, callback) with no copies', () => {

            beforeEach('reset database', done => {
                db.createTables( err => {
                    if (err) throw err;
                    done();
                });
            });

            it('it should return an empty array', done => {
                GameCopy.getAll({}, (err, copies) => {
                    should.equal(err, null);
                    should.exist(copies);
                    copies.length.should.equal(0);
                    done();
                });
            });
        });

        describe('GameCopy.getAll({}, callback) with copies', () => {
            beforeEach('reset database and add dummy data', done => {
                db.createTables( err => {
                    if (err) throw err;
                    db.insertDummyData( err => {
                        if (err) throw err;
                        done();
                    });
                });
            });

            it('it should return multiple copies', done => {
                GameCopy.getAll({}, (err, copies) => {
                    should.equal(err, null);
                    should.exist(copies);
                    copies.length.should.above(1);
                    
                    copies[0].release_id.should.equal(3);
                    copies[0].library_tag.should.equal("00001");
                    copies[0].dt_procured.toISOString().slice(0,10).should.equal("2018-07-01");
                    copies[0].status.should.equal("available");
                    done();
                });
            });

        });
    });

    describe('GameCopy.create()', () => {

        beforeEach('reset database and add dummy data', done => {
            db.createTables( err => {
                if (err) throw err;
                addDepencencies( () => {
                    done();
                });
                
            });
        });

        describe('GameCopy.create({params}, callback)', () => {
            it('it should not start with a GameCopy', done => {
                GameCopy.getAll({}, (err, copies) => {
                    if (err) throw err;
                    copies.length.should.equal(0);
                    done();
                });
            });

            it('it should create a GameCopy', done => {
                GameCopy.create(generic_copy, (err, copy) => {
                    should.equal(err, null);
                    copy.should.exist;

                    copy.release_id.should.equal(generic_copy.release_id);
                    copy.library_tag.should.equal(generic_copy.library_tag);
                    copy.dt_procured.toISOString().slice(0,10).should.equal(generic_copy.dt_procured);
                    copy.status.should.equal("available");
                    done();
                });
            });

            it('it should give an error if missing params', done => {
                const incomplete_copy = Object.assign({}, generic_copy);
                delete incomplete_copy.release_id;

                GameCopy.create(incomplete_copy, (err, copy) => {
                    err.should.be.an.instanceOf(Error);
                    should.not.exist(copy);
                    done();
                });
            });

            it('it should give an error if trying to create a duplicate', done => {
                GameCopy.create(generic_copy, (err, copy) => {
                    should.equal(err, null);
                    copy.should.exist;

                    GameCopy.create(generic_copy, (err, copy) => {
                        err.should.be.an.instanceOf(Error);
                        should.not.exist(copy);
                        done();
                    });
                });
            });
        });
    });

    describe('GameCopy.update()', () => {

        beforeEach('reset db and add copy', done => {
            db.createTables( err => {
                if (err) throw err;
                addDepencencies( () => {
                    GameCopy.create(generic_copy, (err, copy) => {
                        if (err) throw err;
                        done();
                    });
                });
            });
        });

        describe('GameCopy.update({id}, callback)', () => {
            it('it should not modify the copy', done => {
                GameCopy.update({id: 1}, (err, copy) => {
                    should.equal(err, null);
                    copy.should.exist;

                    copy.release_id.should.equal(generic_copy.release_id);
                    copy.library_tag.should.equal(generic_copy.library_tag);
                    copy.dt_procured.toISOString().slice(0,10).should.equal(generic_copy.dt_procured);
                    copy.status.should.equal("available");
                    done();
                });
            });
        });

        describe('GameCopy.update({bad_id}, callback)', () => {
            it('it should give an error', done => {
                GameCopy.update({id: -1}, (err, copy) => {
                    err.should.be.an.instanceOf(Error);
                    should.not.exist(copy);
                    done();
                });
            });
        });

        describe('GameCopy.update({id, params}, callback)', () => {
            it('it should modify the copy', done => {
                const updated_copy = {
                    id: 1,
                    library_tag: "0002",
                    dt_procured: "2018-08-03",
                }

                GameCopy.update(updated_copy, (err, copy) => {
                    should.equal(err, null);
                    copy.should.exist;

                    copy.release_id.should.equal(generic_copy.release_id);
                    copy.library_tag.should.equal("0002");
                    copy.dt_procured.toISOString().slice(0,10).should.equal("2018-08-03");
                    copy.status.should.equal("available");
                    done();
                });
            });
        });
    });

    describe('GameCopy.destroy()', () => {

        beforeEach('reset db and add copy', done => {
            db.createTables( err => {
                if (err) throw err;
                addDepencencies( () => {
                    GameCopy.create(generic_copy, (err, copy) => {
                        if (err) throw err;
                        done();
                    });
                });
            });
        });

        describe('GameCopy.destroy({}, callback', () => {

            it('it should give an error without id', done => {
                GameCopy.destroy({}, (err, result) => {
                    err.should.be.an.instanceOf(Error);
                    should.not.exist(result);

                    GameCopy.getAll( {}, (err, copies) => {
                        should.equal(err, null);
                        copies.length.should.equal(1);
                        done();
                    });
                }); 
            });
        });

        describe('GameCopy.destroy({id}, callback)', () => {

            it('it should destroy a copy with valid id', done => {
                GameCopy.get({id: 1}, (err, copy) => {
                    should.equal(err, null);
                    copy.should.not.be.empty;
                    copy.id.should.equal(1);

                    GameCopy.destroy({id: 1}, (err, result) => {
                        should.equal(err, null);
                        result.should.not.be.empty;

                        GameCopy.getAll( {}, (err, copies) => {
                            should.equal(err, null);
                            copies.should.be.empty;
                            done();
                        });
                    });
                    
                });
            });

            it('it should give an error with invalid id', done => {
                GameCopy.destroy({id: -1}, (err, result) => {
                    err.should.be.an.instanceOf(Error);
                    should.not.exist(result);

                    GameCopy.getAll( {}, (err, copies) => {
                        should.equal(err, null);
                        copies.length.should.equal(1);
                        done();
                    });
                }); 
            });

        });
    });
});

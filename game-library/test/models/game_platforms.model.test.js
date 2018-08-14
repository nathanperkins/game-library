process.env.NODE_ENV = 'test';

const chai     = require('chai');
const should   = chai.should();

const app          = require('../../app');
const db           = require(__basedir + '/db');
const GamePlatform = require(__basedir + '/models/game_platforms');

const test_data        = JSON.parse(require('fs').readFileSync(__basedir + "/test/test_data.json"));
const generic_platform = test_data['platforms']['1'];

describe('Model - GamePlatform', () => {

    describe('GamePlatform.get()', () => {

        beforeEach('reset database and add dummy data', done => {
            db.createTables( err => {
                if (err) throw err;
                db.insertDummyData( err => {
                    if (err) throw err;
                    done();
                });
            });
        });

        describe('GamePlatform.get({id}, callback)', () => {

            it('it should give an error if invalid id', done => {
                GamePlatform.get({id: -1}, (err, platform) => {
                    err.should.be.an.instanceOf(Error);
                    should.not.exist(platform);
                    done();
                });
            });

            it('it should return a platform with valid id', done => {
                GamePlatform.get({id: 1}, (err, platform) => {
                    should.equal(err, null);
                    should.exist(platform);
                    platform.name.should.equal(generic_platform.name);
                    platform.manufacturer.should.equal(generic_platform.manufacturer);
                    platform.release_date.toISOString().slice(0,10).should.equal(generic_platform.release_date);
                    done();
                });
            });

        });
    });

    describe('GamePlatform.getAll()', () => {
        describe('GamePlatform.getAll({}, callback) with no platforms', () => {

            beforeEach('reset database', done => {
                db.createTables( err => {
                    if (err) throw err;
                    done();
                });
            });

            it('it should return an empty array', done => {
                GamePlatform.getAll({}, (err, platforms) => {
                    should.equal(err, null);
                    should.exist(platforms);
                    platforms.length.should.equal(0);
                    done();
                });
            });
        });

        describe('GamePlatform.getAll({}, callback) with platforms', () => {
            beforeEach('reset database and add dummy data', done => {
                db.createTables( err => {
                    if (err) throw err;
                    db.insertDummyData( err => {
                        if (err) throw err;
                        done();
                    });
                });
            });

            it('it should return multiple platforms', done => {
                GamePlatform.getAll({}, (err, platforms) => {
                    should.equal(err, null);
                    should.exist(platforms);
                    platforms.length.should.above(1);
                    platforms[0].name.should.equal("Switch");
                    platforms[1].name.should.equal("Wii U");
                    done();
                });
            });

        });
    });

    describe('GamePlatform.create()', () => {

        beforeEach('reset database and add dummy data', done => {
            db.createTables( err => {
                if (err) throw err;
                done();
            });
        });

        describe('GamePlatform.create({params}, callback)', () => {
            it('it should not start with a GamePlatform', done => {
                GamePlatform.getAll({}, (err, platforms) => {
                    if (err) throw err;
                    platforms.length.should.equal(0);
                    done();
                });
            });

            it('it should create a GamePlatform', done => {
                GamePlatform.create(generic_platform, (err, platform) => {
                    should.equal(err, null);
                    platform.should.exist;
                    platform.name.should.equal(generic_platform.name);
                    platform.manufacturer.should.equal(generic_platform.manufacturer);
                    platform.release_date.toISOString().slice(0,10).should.equal(generic_platform.release_date);
                    done();
                });
            });

            it('it should give an error if missing params', done => {
                const incomplete_platform = Object.assign({}, generic_platform);
                delete incomplete_platform.name;

                GamePlatform.create(incomplete_platform, (err, platform) => {
                    err.should.be.an.instanceOf(Error);
                    should.not.exist(platform);
                    done();
                });
            });

            it('it should give an error if trying to create a duplicate', done => {
                GamePlatform.create(generic_platform, (err, platform) => {
                    should.equal(err, null);
                    platform.should.exist;

                    GamePlatform.create(generic_platform, (err, platform) => {
                        err.should.be.an.instanceOf(Error);
                        should.not.exist(platform);
                        done();
                    });
                });
            });
        });
    });

    describe('GamePlatform.update()', () => {

        beforeEach('reset db and add platform', done => {
            db.createTables( err => {
                if (err) throw err;
                GamePlatform.create(generic_platform, (err, platform) => {
                    if (err) throw err;
                    done();
                });
            });
        });

        describe('GamePlatform.update({id}, callback)', () => {
            it('it should not modify the platform', done => {
                GamePlatform.update({id: 1}, (err, platform) => {
                    should.equal(err, null);
                    platform.should.exist;
                    platform.name.should.equal(generic_platform.name);
                    platform.manufacturer.should.equal(generic_platform.manufacturer);
                    platform.release_date.toISOString().slice(0,10).should.equal(generic_platform.release_date);
                    done();
                });
            });
        });

        describe('GamePlatform.update({bad_id}, callback)', () => {
            it('it should give an error', done => {
                GamePlatform.update({id: -1}, (err, platform) => {
                    err.should.be.an.instanceOf(Error);
                    should.not.exist(platform);
                    done();
                });
            });
        });

        describe('GamePlatform.update({id, params}, callback)', () => {
            it('it should modify the platform', done => {
                const updated_platform = {
                    id: 1,
                    name: "Modified platform",
                }

                GamePlatform.update(updated_platform, (err, platform) => {
                    should.equal(err, null);
                    platform.should.exist;
                    platform.name.should.equal("Modified platform");
                    platform.manufacturer.should.equal(generic_platform.manufacturer);
                    platform.release_date.toISOString().slice(0,10).should.equal(generic_platform.release_date);
                    done();
                });
            });
        });
    });

    describe('GamePlatform.destroy()', () => {

        beforeEach('reset database', done => {
            db.createTables( err => {
                if (err) throw err;
                GamePlatform.create(generic_platform, (err, platform) => {
                    if (err) throw err;
                    done();
                });
            });
        });

        describe('GamePlatform.destroy({}, callback', () => {

            it('it should give an error without id', done => {
                GamePlatform.destroy({}, (err, result) => {
                    err.should.be.an.instanceOf(Error);
                    should.not.exist(result);

                    GamePlatform.getAll( {}, (err, platforms) => {
                        should.equal(err, null);
                        platforms.length.should.equal(1);
                        done();
                    });
                }); 
            });
        });

        describe('GamePlatform.destroy({id}, callback)', () => {

            it('it should destroy a platform with valid id', done => {
                GamePlatform.get({id: 1}, (err, platform) => {
                    should.equal(err, null);
                    platform.should.not.be.empty;
                    platform.id.should.equal(1);

                    GamePlatform.destroy({id: 1}, (err, result) => {
                        should.equal(err, null);
                        result.should.not.be.empty;

                        GamePlatform.getAll( {}, (err, platforms) => {
                            should.equal(err, null);
                            platforms.should.be.empty;
                            done();
                        });
                    });
                    
                });
            });

            it('it should give an error with invalid id', done => {
                GamePlatform.destroy({id: -1}, (err, result) => {
                    err.should.be.an.instanceOf(Error);
                    should.not.exist(result);

                    GamePlatform.getAll( {}, (err, platforms) => {
                        should.equal(err, null);
                        platforms.length.should.equal(1);
                        done();
                    });
                }); 
            });

        });
    });
});

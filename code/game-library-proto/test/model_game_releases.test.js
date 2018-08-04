process.env.NODE_ENV = 'test';

const chai     = require('chai');
const should   = chai.should();

const db           = require('../db');
const GameRelease  = require('../models/game_releases');
const GameTitle    = require('../models/game_titles');
const GamePlatform = require('../models/game_platforms');

const test_data        = JSON.parse(require('fs').readFileSync("test/test_data.json"));
const generic_release  = test_data['releases']['1'];
const generic_title    = test_data['titles']['1'];
const generic_platform = test_data['platforms']['1'];

describe('Model - GameRelease', () => {

    describe('GameRelease.get()', () => {

        beforeEach('reset database and add dummy data', done => {
            db.createTables( err => {
                if (err) throw err;
                db.insertDummyData( err => {
                    if (err) throw err;
                    done();
                });
            });
        });

        describe('GameRelease.get({id}, callback)', () => {

            it('it should give an error if invalid id', done => {
                GameRelease.get({id: -1}, (err, release) => {
                    err.should.be.an.instanceOf(Error);
                    should.not.exist(release);
                    done();
                });
            });

            it('it should return a release with valid id', done => {
                GameRelease.get({id: 3}, (err, release) => {
                    should.equal(err, null);
                    should.exist(release);

                    release.title_id.should.equal(1);
                    release.title.should.equal("The Legend of Zelda: Breath of the Wild");
                    release.platform_id.should.equal(1);
                    release.platform.should.equal("Switch");
                    release.platform_id.should.equal(generic_release.platform_id);
                    release.release_date.toISOString().slice(0,10).should.equal(generic_release.release_date);
                    done();
                });
            });

        });
    });

    describe('GameRelease.getAll()', () => {
        describe('GameRelease.getAll({}, callback) with no releases', () => {

            beforeEach('reset database', done => {
                db.createTables( err => {
                    if (err) throw err;
                    done();
                });
            });

            it('it should return an empty array', done => {
                GameRelease.getAll({}, (err, releases) => {
                    should.equal(err, null);
                    should.exist(releases);
                    releases.length.should.equal(0);
                    done();
                });
            });
        });

        describe('GameRelease.getAll({}, callback) with releases', () => {
            beforeEach('reset database and add dummy data', done => {
                db.createTables( err => {
                    if (err) throw err;
                    db.insertDummyData( err => {
                        if (err) throw err;
                        done();
                    });
                });
            });

            it('it should return multiple releases', done => {
                GameRelease.getAll({}, (err, releases) => {
                    should.equal(err, null);
                    should.exist(releases);
                    releases.length.should.above(1);

                    releases[0].title_id.should.equal(1);
                    releases[0].title.should.equal("The Legend of Zelda: Breath of the Wild");
                    releases[0].platform_id.should.equal(1);
                    releases[0].platform.should.equal("Switch");
                    releases[0].platform_id.should.equal(generic_release.platform_id);
                    releases[0].release_date.toISOString().slice(0,10).should.equal(generic_release.release_date);
                    done();
                });
            });

        });
    });

    describe('GameRelease.create()', () => {

        beforeEach('reset database and add dummy data', done => {
            db.createTables( err => {
                if (err) throw err;
                GameTitle.create(generic_title, (err, title) => {
                    if (err) throw err;
                    GamePlatform.create(generic_platform, (err, platform) => {
                        if (err) throw err;
                        done();
                    });
                });
            });
        });

        describe('GameRelease.create({params}, callback)', () => {
            it('it should not start with a GameRelease', done => {
                GameRelease.getAll({}, (err, releases) => {
                    if (err) throw err;
                    releases.length.should.equal(0);
                    done();
                });
            });

            it('it should create a GameRelease', done => {
                GameRelease.create(generic_release, (err, release) => {
                    should.equal(err, null);
                    release.should.exist;
                    
                    release.title_id.should.equal(generic_release.title_id);
                    release.title.should.equal(generic_title.name);
                    release.title_id.should.equal(generic_release.title_id);
                    release.platform.should.equal(generic_platform.name);
                    release.platform_id.should.equal(generic_release.platform_id);
                    release.release_date.toISOString().slice(0,10).should.equal(generic_release.release_date);
                    done();
                });
            });

            it('it should give an error if missing params', done => {
                const incomplete_release = Object.assign({}, generic_release);
                delete incomplete_release.title_id;

                GameRelease.create(incomplete_release, (err, release) => {
                    err.should.be.an.instanceOf(Error);
                    should.not.exist(release);
                    done();
                });
            });

            it('it should give an error if trying to create a duplicate', done => {
                GameRelease.create(generic_release, (err, release) => {
                    should.equal(err, null);
                    release.should.exist;

                    GameRelease.create(generic_release, (err, release) => {
                        err.should.be.an.instanceOf(Error);
                        should.not.exist(release);
                        done();
                    });
                });
            });
        });
    });

    describe('GameRelease.update()', () => {

        beforeEach('reset database', done => {
            db.createTables( err => {
                if (err) throw err;
                GameTitle.create(generic_title, (err, title) => {
                    if (err) throw err;
                    GamePlatform.create(generic_platform, (err, platform) => {
                        if (err) throw err;
                        GameRelease.create(generic_release, (err, release) => {
                            if (err) throw err;
                            done();
                        });
                    });
                });
            });
        });

        describe('GameRelease.update({id}, callback)', () => {
            it('it should not modify the release', done => {
                GameRelease.update({id: 1}, (err, release) => {
                    should.equal(err, null);
                    release.should.exist;

                    release.title_id.should.equal(generic_release.title_id);
                    release.title.should.equal(generic_title.name);
                    release.title_id.should.equal(generic_release.title_id);
                    release.platform.should.equal(generic_platform.name);
                    release.platform_id.should.equal(generic_release.platform_id);
                    release.release_date.toISOString().slice(0,10).should.equal(generic_release.release_date);
                    done();
                });
            });
        });

        describe('GameRelease.update({bad_id}, callback)', () => {
            it('it should give an error', done => {
                GameRelease.update({id: -1}, (err, release) => {
                    err.should.be.an.instanceOf(Error);
                    should.not.exist(release);
                    done();
                });
            });
        });

        describe('GameRelease.update({id, params}, callback)', () => {
            it('it should modify the release', done => {
                const updated_release = {
                    id: 1,
                    release_date: "2018-08-01",
                }

                GameRelease.update(updated_release, (err, release) => {
                    should.equal(err, null);
                    release.should.exist;

                    release.title_id.should.equal(generic_release.title_id);
                    release.title.should.equal(generic_title.name);
                    release.title_id.should.equal(generic_release.title_id);
                    release.platform.should.equal(generic_platform.name);
                    release.platform_id.should.equal(generic_release.platform_id);
                    release.release_date.toISOString().slice(0,10).should.equal("2018-08-01");
                    done();
                });
            });
        });
    });

    describe('GameRelease.destroy()', () => {

        beforeEach('reset database', done => {
            db.createTables( err => {
                if (err) throw err;
                GameTitle.create(generic_title, (err, title) => {
                    if (err) throw err;
                    GamePlatform.create(generic_platform, (err, platform) => {
                        if (err) throw err;
                        GameRelease.create(generic_release, (err, release) => {
                            if (err) throw err;
                            done();
                        });
                    });
                });
            });
        });

        describe('GameRelease.destroy({}, callback', () => {

            it('it should give an error without id', done => {
                GameRelease.destroy({}, (err, result) => {
                    err.should.be.an.instanceOf(Error);
                    should.not.exist(result);

                    GameRelease.getAll( {}, (err, releases) => {
                        should.equal(err, null);
                        releases.length.should.equal(1);
                        done();
                    });
                }); 
            });
        });

        describe('GameRelease.destroy({id}, callback)', () => {

            it('it should destroy a release with valid id', done => {
                GameRelease.get({id: 1}, (err, release) => {
                    should.equal(err, null);
                    release.should.not.be.empty;
                    release.id.should.equal(1);

                    GameRelease.destroy({id: 1}, (err, result) => {
                        should.equal(err, null);
                        result.should.not.be.empty;

                        GameRelease.getAll( {}, (err, releases) => {
                            should.equal(err, null);
                            releases.should.be.empty;
                            done();
                        });
                    });
                    
                });
            });

            it('it should give an error with invalid id', done => {
                GameRelease.destroy({id: -1}, (err, result) => {
                    err.should.be.an.instanceOf(Error);
                    should.not.exist(result);

                    GameRelease.getAll( {}, (err, releases) => {
                        should.equal(err, null);
                        releases.length.should.equal(1);
                        done();
                    });
                }); 
            });

        });
    });
});

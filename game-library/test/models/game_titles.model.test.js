process.env.NODE_ENV = 'test';

const chai     = require('chai');
const should   = chai.should();

const app          = require('../../app');
const db           = require(__basedir + '/db');
const GameTitle    = require(__basedir + '/models/game_titles');

const test_data        = JSON.parse(require('fs').readFileSync(__basedir + "/test/test_data.json"));
const generic_title = test_data['titles']['1'];

describe('Model - GameTitle', () => {

    describe('GameTitle.get()', () => {

        beforeEach('reset database and add dummy data', done => {
            db.createTables( err => {
                if (err) throw err;
                db.insertDummyData( err => {
                    if (err) throw err;
                    done();
                });
            });
        });

        describe('GameTitle.get({id}, callback)', () => {

            it('it should give an error if invalid id', done => {
                GameTitle.get({id: -1}, (err, title) => {
                    err.should.be.an.instanceOf(Error);
                    should.not.exist(title);
                    done();
                });
            });

            it('it should return a title with valid id', done => {
                GameTitle.get({id: 1}, (err, title) => {
                    should.equal(err, null);
                    should.exist(title);
                    title.name.should.match(/The Legend of Zelda: Breath of the Wild/);
                    title.description.should.match(/Forget everything/);
                    title.genre.should.equal('Action');
                    title.developer.should.equal('Nintendo');
                    title.producer.should.equal('Nintendo');
                    done();
                });
            });

        });
    });

    describe('GameTitle.getAll()', () => {
        describe('GameTitle.getAll({}, callback) with no titles', () => {

            beforeEach('reset database', done => {
                db.createTables( err => {
                    if (err) throw err;
                    done();
                });
            });

            it('it should return an empty array', done => {
                GameTitle.getAll({}, (err, titles) => {
                    should.equal(err, null);
                    should.exist(titles);
                    titles.length.should.equal(0);
                    done();
                });
            });
        });

        describe('GameTitle.getAll({}, callback) with titles', () => {
            beforeEach('reset database and add dummy data', done => {
                db.createTables( err => {
                    if (err) throw err;
                    db.insertDummyData( err => {
                        if (err) throw err;
                        done();
                    });
                });
            });

            it('it should return multiple titles', done => {
                GameTitle.getAll({}, (err, titles) => {
                    should.equal(err, null);
                    should.exist(titles);
                    titles.length.should.above(1);
                    titles[0].name.should.match(/The Legend of Zelda: Breath of the Wild/);
                    titles[1].name.should.match(/Stardew Valley/);
                    done();
                });
            });

        });
    });

    describe('GameTitle.create()', () => {

        beforeEach('reset database and add dummy data', done => {
            db.createTables( err => {
                if (err) throw err;
                done();
            });
        });

        describe('GameTitle.create({params}, callback)', () => {
            it('it should not start with a GameTitle', done => {
                GameTitle.getAll({}, (err, titles) => {
                    if (err) throw err;
                    titles.length.should.equal(0);
                    done();
                });
            });

            it('it should create a GameTitle', done => {
                GameTitle.create(generic_title, (err, title) => {
                    should.equal(err, null);
                    title.should.exist;
                    title.name.should.equal(generic_title.name);
                    title.description.should.equal(generic_title.description);
                    title.genre.should.equal(generic_title.genre);
                    title.developer.should.equal(generic_title.developer);
                    title.producer.should.equal(generic_title.producer);
                    done();
                });
            });

            it('it should give an error if missing params', done => {
                const incomplete_title = Object.assign({}, generic_title);
                delete incomplete_title.name;

                GameTitle.create(incomplete_title, (err, title) => {
                    err.should.be.an.instanceOf(Error);
                    should.not.exist(title);
                    done();
                });
            });

            it('it should give an error if trying to create a duplicate', done => {
                GameTitle.create(generic_title, (err, title) => {
                    should.equal(err, null);
                    title.should.exist;

                    GameTitle.create(generic_title, (err, title) => {
                        err.should.be.an.instanceOf(Error);
                        should.not.exist(title);
                        done();
                    });
                });
            });
        });
    });

    describe('GameTitle.update()', () => {

        beforeEach('reset db and add title', done => {
            db.createTables( err => {
                if (err) throw err;
                GameTitle.create(generic_title, (err, title) => {
                    if (err) throw err;
                    done();
                });
            });
        });

        describe('GameTitle.update({id}, callback)', () => {
            it('it should not modify the title', done => {
                GameTitle.update({id: 1}, (err, title) => {
                    should.equal(err, null);
                    title.should.exist;
                    title.name.should.equal(generic_title.name);
                    title.description.should.equal(generic_title.description);
                    title.genre.should.equal(generic_title.genre);
                    title.developer.should.equal(generic_title.developer);
                    title.producer.should.equal(generic_title.producer);
                    done();
                });
            });
        });

        describe('GameTitle.update({bad_id}, callback)', () => {
            it('it should give an error', done => {
                GameTitle.update({id: -1}, (err, title) => {
                    err.should.be.an.instanceOf(Error);
                    should.not.exist(title);
                    done();
                });
            });
        });

        describe('GameTitle.update({id, params}, callback)', () => {
            it('it should modify the title', done => {
                const updated_title = {
                    id: 1,
                    name: "Modified Title",
                }

                GameTitle.update(updated_title, (err, title) => {
                    should.equal(err, null);
                    title.should.exist;
                    title.name.should.equal("Modified Title");
                    title.description.should.equal(generic_title.description);
                    title.genre.should.equal(generic_title.genre);
                    title.developer.should.equal(generic_title.developer);
                    title.producer.should.equal(generic_title.producer);
                    done();
                });
            });
        });
    });

    describe('GameTitle.destroy()', () => {

        beforeEach('reset database', done => {
            db.createTables( err => {
                if (err) throw err;
                GameTitle.create(generic_title, (err, title) => {
                    if (err) throw err;
                    done();
                });
            });
        });

        describe('GameTitle.destroy({}, callback', () => {

            it('it should give an error without id', done => {
                GameTitle.destroy({}, (err, result) => {
                    err.should.be.an.instanceOf(Error);
                    should.not.exist(result);

                    GameTitle.getAll( {}, (err, titles) => {
                        should.equal(err, null);
                        titles.length.should.equal(1);
                        done();
                    });
                }); 
            });
        });

        describe('GameTitle.destroy({id}, callback)', () => {

            it('it should destroy a title with valid id', done => {
                GameTitle.get({id: 1}, (err, title) => {
                    should.equal(err, null);
                    title.should.not.be.empty;
                    title.id.should.equal(1);

                    GameTitle.destroy({id: 1}, (err, result) => {
                        should.equal(err, null);
                        result.should.not.be.empty;

                        GameTitle.getAll( {}, (err, titles) => {
                            should.equal(err, null);
                            titles.should.be.empty;
                            done();
                        });
                    });
                    
                });
            });

            it('it should give an error with invalid id', done => {
                GameTitle.destroy({id: -1}, (err, result) => {
                    err.should.be.an.instanceOf(Error);
                    should.not.exist(result);

                    GameTitle.getAll( {}, (err, titles) => {
                        should.equal(err, null);
                        titles.length.should.equal(1);
                        done();
                    });
                }); 
            });

        });
    });
});

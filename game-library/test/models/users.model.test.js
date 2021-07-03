process.env.NODE_ENV = 'test';

const chai   = require('chai');
const should = chai.should();

const app  = require('../../app');
const db   = require(__basedir + '/db');
const User = require(__basedir + '/models/users');

const test_data        = JSON.parse(require('fs').readFileSync(__basedir + "/test/test_data.json"));
const generic_user = test_data['users']['1'];

describe('Model - Users', () => {

    describe('User.get()', () => {

        beforeEach('reset database and add dummy data', done => {
            db.createTables( err => {
                if (err) throw err;
                db.insertDummyData( err => {
                    if (err) throw err;
                    done();
                })
            });
        });

        describe('User.get({id}, callback)', () => {

            it('it should give an error if invalid id', done => {
                User.get({id: -1}, (err, user) => {
                    err.should.be.an.instanceOf(Error);
                    should.not.exist(user);
                    done();
                });
            });

            it('it should return Kailee with id 58', done => {
                User.get({id: 58}, (err, user) => {
                    should.equal(err, null);
                    user.first_name.should.equal('Kailee');
                    user.last_name.should.equal('Crist');
                    done();
                });
            });

        });

        describe('User.get({email}, callback)', () => {

            it('it should give an error if invalid email', done => {
                User.get({email: "invalid@email.com"}, (err, user) => {
                    err.should.be.an.instanceOf(Error);
                    should.not.exist(user);
                    done();
                });
            });

            it('it should return Kailee with her email', done => {
                User.get({email: "kailee.crist@oberbrunnerkutchandlockman.com"}, (err, user) => {
                    should.equal(err, null);
                    user.first_name.should.equal('Kailee');
                    user.last_name.should.equal('Crist');
                    done();
                });
            });

        });

    });

    describe('User.getAll()', () => {

        beforeEach('reset database and add dummy data', done => {
            db.createTables( err => {
                if (err) throw err;
                db.insertDummyData( err => {
                    if (err) throw err;
                    done();
                })
            });
        });

        describe('User.getAll({}, callback)', () => {

            it('it should get many users', done => {
                User.getAll( {}, (err, users) => {
                    should.equal(err, null);
                    users.length.should.be.above(1);
                    done();
                });
            });

            it('it should have Kailee first', done => {
                User.getAll( {}, (err, users) => {
                    should.equal(err, null);
                    users.sort( (a, b) => a.id - b.id );
                    users[0].first_name.should.equal('Kailee');
                    users[0].last_name.should.equal('Crist');
                    done();
                });
            });

            it('it should have Brian second', done => {
                User.getAll( {}, (err, users) => {
                    should.equal(err, null);
                    users.sort( (a, b) => a.id - b.id );
                    users[1].first_name.should.equal('Brian');
                    users[1].last_name.should.equal('Dibbert');
                    done();
                });
            });
        });
    });

    describe('User.create()', () => {

        beforeEach('reset database', done => {
            db.createTables( err => {
                if (err) throw err;
                done();
            });
        });

        describe('User.create({user})', () => {

            it('it should not have a user yet', done => {
                User.getAll( {}, (err, users) => {
                    should.equal(err, null);
                    users.should.be.empty;
                    done();
                });
            });

            it('it should add a user', done => {

                User.create(generic_user, (err, new_user) => {
                    should.equal(err, null);
                    new_user.should.not.be.empty;
                    new_user.first_name.should.equal(generic_user.first_name);
                    new_user.last_name.should.equal(generic_user.last_name);
                    new_user.email.should.equal(generic_user.email);
                    new_user.should.not.have.property('password');

                    User.password({id: new_user.id}, (err, new_user) => {
                        should.equal(err, null);
                        new_user.should.have.property('password');
                        new_user.password.should.not.equal(generic_user.password);
                        done();
                    });
                });
            });

            it('it should give an error if params are missing', done => {
                User.create({first_name: "Invalid", last_name: "User"}, (err, new_user) => {
                    err.should.be.an.instanceOf(Error);
                    should.not.exist(new_user);

                    User.getAll( {}, (err, users) => {
                        should.equal(err, null);
                        users.length.should.equal(0);
                        done();
                    });
                });
            });

            it('it should give an error on duplicate user', done => {
                User.create(generic_user, (err, new_user) => {
                    should.equal(err, null);
                    new_user.should.not.be.empty;

                    User.create({
                        first_name: "Second",
                        last_name : "User",
                        password  : "Password456",
                        email     : generic_user.email,
                    }, (err, new_user) => {
                        err.should.be.an.instanceOf(Error);
                        should.not.exist(new_user);
                        done();
                    });
                });
            });

        });
    });

    describe('User.password()', () => {
        beforeEach('reset database and add user', done => {
            db.createTables( err => {
                if (err) throw err;
                User.create(generic_user, (err, user) => {
                    if (err) throw err;
                    done();
                });
            });
        });

        describe('User.password({id}, callback)', () => {

            it('it should return login info from id', done => {
                User.password({id: 1}, (err, user) => {
                    user.should.have.property('id');
                    user.should.have.property('email');
                    user.should.have.property('password');
                    done();
                });
            });

            it('it should give error with invalid id', done => {
                User.password({id: -1}, (err, user) => {
                    err.should.be.an.instanceOf(Error);
                    should.not.exist(user);
                    done();
                }); 
            });
        });

        describe('User.password({email}, callback)', () => {
            it('it should return login info from email', done => {
                User.password({email: generic_user.email}, (err, user) => {
                    user.should.have.property('id');
                    user.should.have.property('email');
                    user.should.have.property('password');
                    done();
                });
            });
        
            it('it should give an error with invalid email', done => {
                User.password({email: "invalid@email.com"}, (err, user) => {
                    err.should.be.an.instanceOf(Error);
                    should.not.exist(user);
                    done();
                }); 
            });
        });
        
    });

    describe('User.destroy()', () => {

        beforeEach('reset database', done => {
            db.createTables( err => {
                if (err) throw err;
                User.create(generic_user, (err, user) => {
                    if (err) throw err;
                    done();
                });
            });
        });

        describe('User.destroy({}, callback', () => {

            it('it should give an error without id', done => {
                User.destroy({}, (err, result) => {
                    err.should.be.an.instanceOf(Error);
                    should.not.exist(result);

                    User.getAll( {}, (err, users) => {
                        should.equal(err, null);
                        users.length.should.equal(1);
                        done();
                    });
                }); 
            });
        });

        describe('User.destroy({id}, callback)', () => {

            it('it should destroy a user with valid id', done => {
                User.get({id: 1}, (err, user) => {
                    should.equal(err, null);
                    user.should.not.be.empty;
                    user.id.should.equal(1);

                    User.destroy({id: 1}, (err, result) => {
                        should.equal(err, null);
                        result.should.not.be.empty;

                        User.getAll( {}, (err, users) => {
                            should.equal(err, null);
                            users.should.be.empty;
                            done();
                        });
                    });
                    
                });
            });

            it('it should give an error with invalid id', done => {
                User.destroy({id: -1}, (err, result) => {
                    err.should.be.an.instanceOf(Error);
                    should.not.exist(result);

                    User.getAll( {}, (err, users) => {
                        should.equal(err, null);
                        users.length.should.equal(1);
                        done();
                    });
                }); 
            });

        });
    });

    describe('User.update()', () => {
        beforeEach('reset database', done => {
            db.createTables( err => {
                if (err) throw err;
                User.create(generic_user, (err, user) => {
                    if (err) throw err;
                    done();
                });
            });
        });

        describe('User.update({params}, callback)', () => {

            it('it should update the name', done => {
                const updated_first = "UpdatedFirst";
                const updated_last  = "UpdatedLast";

                User.update({
                    id         : 1,
                    first_name : updated_first,
                    last_name  : updated_last,
                }, (err, user) => {
                    should.equal(err, null);
                    user.first_name.should.equal(updated_first);
                    user.last_name .should.equal(updated_last);
                    user.email     .should.equal(generic_user.email);
                    user           .role.should.equal(generic_user.role);
                    done();
                });
            });

            it('it should update the email', done => {
                const updated_email = "updated@email.com";

                User.update({
                    id         : 1,
                    email      : updated_email,
                }, (err, user) => {
                    should.equal(err, null);
                    user.first_name.should.equal(generic_user.first_name);
                    user.last_name .should.equal(generic_user.last_name);
                    user.email     .should.equal(updated_email);
                    user.role      .should.equal(generic_user.role);
                    done();
                });
            });

            it('it should update the role', done => {
                const updated_role = "admin";

                User.update({
                    id         : 1,
                    role       : updated_role,
                }, (err, user) => {
                    should.equal(err, null);
                    user.first_name.should.equal(generic_user.first_name);
                    user.last_name .should.equal(generic_user.last_name);
                    user.email     .should.equal(generic_user.email);
                    user.role      .should.equal(updated_role);
                    done();
                });
            });

            it('it should give an error with invalid id', done => {
                User.update({
                    id         : -1,
                    first_name : "UpdatedFirst",
                    last_name  : "UpdatedLast",
                }, (err, user) => {
                    err.should.be.an.instanceOf(Error);
                    should.not.exist(user);
                    done();
                });
            });

            it('it should give an error when trying to update the password', done => {
                User.update({
                    id: 1,
                    password: "dont_update123",
                }, (err, user) => {
                    err.should.be.an.instanceOf(Error);
                    should.not.exist(user);
                    done();
                }); 
            });

        });
    });

    describe('User.login()', () => {
        beforeEach('reset database', done => {
            db.createTables( err => {
                if (err) throw err;
                User.create(generic_user, (err, user) => {
                    if (err) throw err;
                    done();
                });
            });
        });

        describe('User.login() missing email', () => {
            it('it should give an error', done => {
                User.login({
                    password: generic_user.password,
                }, (err, user) => {
                    err.should.be.an.instanceOf(Error);
                    user.should.be.false;
                    done();
                });
            });
        });

        describe('User.login() missing password', () => {
            it('it should give an error', done => {
                User.login({
                    email: generic_user.email,
                }, (err, user) => {
                    err.should.be.an.instanceOf(Error);
                    user.should.be.false;
                    done();
                });
            });
        });

        describe('User.login() incorrect password', () => {
            it('it should not return a user', done => {
                User.login({
                    email: generic_user.email,
                    password: "bad password",
                }, (err, user) => {
                    should.equal(err, null);
                    user.should.be.false;
                    done();
                });
            });
        });

        describe('User.login() correct password', () => {
            it('it should return the user', done => {
                User.login({
                    email: generic_user.email,
                    password: generic_user.password,
                }, (err, user) => {
                    should.equal(err, null);
                    user.should.exist;
                    user.should.not.have.property('password');
                    user.id.should.equal(1);
                    done();
                });
            });
        });
    });
});

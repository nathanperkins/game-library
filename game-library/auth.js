const passport      = require('passport')
const LocalStrategy = require('passport-local').Strategy

const app           = require('./app')
const User          = require(__basedir + '/models/users')

passport.use(new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password'
    },
    (email, password, done) => {
        User.login({email, password}, (err, user) => {
            if (err) { return done(err, false); }
            if (!user) { return done(null, false, { message: 'Incorrect email or password' }); }
            return done(null, user)
        })
    }
))

passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    User.get({id}, function(err, user) {
        done(err, user);
    });
});

module.exports = passport
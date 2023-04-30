const passport = require('passport');

const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user');

//authtication using passport
passport.use(new LocalStrategy({
    usernameField: 'email',
    passReqToCallback: true
},
    function (req, email, password, done) {
        //find a user and establish the identity
        User.findOne({ email: email })
            .then((user) => {
                if (!user || user.password != password) {
                    req.flash('error', 'Invalid Username/Password');
                    return done(null, false);
                }

                return done(null, user);
            })
            .catch((err) => {
                req.flash('error', err);
                return done(err);
            })
    }
));

// serialising the user to decide which key is to be kept in the cookies

passport.serializeUser(function (user, done) {
    done(null, user.id);
});

//deserialising the user from the key in the cookies
passport.deserializeUser(function (id, done) {
    User.findById(id)
        .then((user) => {
            return done(null, user);
        })
        .catch((err) => {
            console.log('Error in finding user-->Passport');
            return done(err);
        })
});

//check if user is autheticated
passport.checkAuthentication = function (req, res, next) {
    //if user is signed in then pass on the request to next function(controller's action)
    if (req.isAuthenticated()) {
        return next();
    }

    //if user is not signed in 
    return res.redirect('/users/sign-in');
}

passport.setAuthenticatedUser = function (req, res, next) {
    if (req.isAuthenticated()) {
        //req.user contains the current signed in iser from the sesssion cookie and we are just sending this to locals for views
        res.locals.user = req.user;
    }
    next();
}

module.exports = passport;
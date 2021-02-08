const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const config = require('./index');
const User = require('../models/User');
const mongoose = require('mongoose');

// Serialize & Deserialize for Cookies
passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser((id, done) =>
    User.findById(id).then((user) => done(null, user))
);

// Configure Passport Strategy
passport.use(
    new GoogleStrategy(
        {
            clientID: config.google_id,
            clientSecret: config.google_secret,
            callbackURL: '/api/auth/google/redirect',
        },
        (accessToken, refreshToken, profile, done) => {
            User.findOne({ googleId: profile.id }).then((user) => {
                if (user) {
                    console.log('User already exists', profile);
                    done(null, user);
                } else {
                    console.log('New User being created...');
                    new User({
                        _id: mongoose.Types.ObjectId(),
                        googleId: profile.id,
                        username: profile.displayName,
                        photo: profile.photos[0],
                    })
                        .save()
                        .then((newUser) => done(null, newUser));
                }
            });
        }
    )
);

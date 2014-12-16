'use strict';

//var Token = require('../models/token');

exports = module.exports = function (app, passport) {
    var LocalStrategy = require('passport-local').Strategy,
        TwitterStrategy = require('passport-twitter').Strategy,
        GitHubStrategy = require('passport-github').Strategy,
        FacebookStrategy = require('passport-facebook').Strategy,
        GoogleStrategy = require('passport-google-oauth').OAuth2Strategy,
        TumblrStrategy = require('passport-tumblr').Strategy,
        Khbar4uStrategy = require('passport-khbar4u-oauth').OAuth2Strategy,
    //BasicStrategy = require('passport-http').BasicStrategy,
        clientStrategy = require('./Util/clientStrategy').Strategy,
        BearerStrategy = require('./Util/bearerStrategy').Strategy;

    passport.use(new LocalStrategy(
        function (username, password, done) {
            var conditions = {isActive: 'yes'};
            if (username.indexOf('@') === -1) {
                conditions.username = username;
            }
            else {
                conditions.email = username;
            }

            app.db.models.User.findOne(conditions, function (err, user) {
                if (err) {
                    return done(err);
                }

                if (!user) {
                    return done(null, false, {message: 'Unknown user'});
                }

                app.db.models.User.validatePassword(password, user.password, function (err, isValid) {
                    if (err) {
                        return done(err);
                    }

                    if (!isValid) {
                        return done(null, false, {message: 'Invalid password'});
                    }

                    return done(null, user);
                });
            });
        }
    ));

    if (app.config.oauth.twitter.key) {
        passport.use(new TwitterStrategy({
                consumerKey: app.config.oauth.twitter.key,
                consumerSecret: app.config.oauth.twitter.secret
            },
            function (token, tokenSecret, profile, done) {
                done(null, false, {
                    token: token,
                    tokenSecret: tokenSecret,
                    profile: profile
                });
            }
        ));
    }

    if (app.config.oauth.github.key) {
        passport.use(new GitHubStrategy({
                clientID: app.config.oauth.github.key,
                clientSecret: app.config.oauth.github.secret,
                customHeaders: {"User-Agent": app.config.projectName}
            },
            function (accessToken, refreshToken, profile, done) {
                done(null, false, {
                    accessToken: accessToken,
                    refreshToken: refreshToken,
                    profile: profile
                });
            }
        ));
    }

    if (app.config.oauth.facebook.key) {
        passport.use(new FacebookStrategy({
                clientID: app.config.oauth.facebook.key,
                clientSecret: app.config.oauth.facebook.secret
            },
            function (accessToken, refreshToken, profile, done) {
                done(null, false, {
                    accessToken: accessToken,
                    refreshToken: refreshToken,
                    profile: profile
                });
            }
        ));
    }

    if (app.config.oauth.google.key) {
        passport.use(new GoogleStrategy({
                clientID: app.config.oauth.google.key,
                clientSecret: app.config.oauth.google.secret
            },
            function (accessToken, refreshToken, profile, done) {
                done(null, false, {
                    accessToken: accessToken,
                    refreshToken: refreshToken,
                    profile: profile
                });
            }
        ));
    }

    if (app.config.oauth.tumblr.key) {
        passport.use(new TumblrStrategy({
                consumerKey: app.config.oauth.tumblr.key,
                consumerSecret: app.config.oauth.tumblr.secret
            },
            function (token, tokenSecret, profile, done) {
                done(null, false, {
                    token: token,
                    tokenSecret: tokenSecret,
                    profile: profile
                });
            }
        ));
    }

    if (app.config.oauth.khbar4u.key) {
        passport.use(new Khbar4uStrategy({
                clientID: app.config.oauth.khbar4u.key,
                clientSecret: app.config.oauth.khbar4u.secret
            },
            function (accessToken, refreshToken, profile, done) {
                done(null, false, {
                    accessToken: accessToken,
                    refreshToken: refreshToken,
                    profile: profile
                });
            }
        ));
    }


    passport.use(new clientStrategy(
        {usernameField: 'client_id', passwordField: 'client_secret'}
        , function (username, password, callback) {
            app.db.models.Client.findOne({id: username}, function (err, client) {
                if (err) {
                    return callback(err);
                }

                // No client found with that id or bad password
                if (!client || client.secret !== password) {
                    return callback(null, false);
                }

                // Success
                return callback(null, client);
            });
        }
    ));
    //var Token = app.db.model.Token;
    passport.use(new BearerStrategy(
        function (accessToken, callback) {
            app.db.models.Token.findOne({value: JSON.parse(accessToken).value}, function (err, token) {
                if (err) {
                    return callback(err);
                }

                // No token found
                if (!token) {
                    return callback(null, false);
                }

                app.db.models.User.findOne({_id: token.userId}, function (err, user) {
                    if (err) {
                        return callback(err);
                    }

                    // No user found
                    if (!user) {
                        return callback(null, false);
                    }

                    // Simple example with no scope
                    callback(null, user, {scope: '*'});
                });
            });
        }
    ));


    passport.serializeUser(function (user, done) {
        done(null, user._id);
    });

    passport.deserializeUser(function (id, done) {
        app.db.models.User.findOne({_id: id}).populate('roles.admin').populate('roles.account').exec(function (err, user) {
            if (user && user.roles && user.roles.admin) {
                user.roles.admin.populate("groups", function (err, admin) {
                    done(err, user);
                });
            }
            else {
                done(err, user);
            }
        });
    });
};

/**
 * Created by ahmedgalal on 11/7/14.
 */

exports = module.exports = function(app, mongoose) {
// Load required packages
    var oauth2orize = require('oauth2orize'),
        db = app.db.models,
        User=db.User, Client=db.Client, Token=db.Token, Code= db.Code;
    //var User = require('../../schema/User');
    //var Client = require('../../schema/client');
    //var Token = require('../../schema/token');
    //var Code = require('../../schema/code');


// Create OAuth 2.0 server
    var oauth2server = oauth2orize.createServer();

    oauth2server.utils = {};
    oauth2server.utils.uid =
        function(len) {
            var buf = []
                , chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
                , charlen = chars.length;

            for (var i = 0; i < len; ++i) {
                buf.push(chars[oauth2server.utils.getRandomInt(0, charlen - 1)]);
            }

            return buf.join('');
        };

    oauth2server.utils.getRandomInt =
        function(min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        };

// Register serialialization function
    oauth2server.serializeClient(function (client, callback) {
        return callback(null, client._id);
    });

// Register deserialization function
    oauth2server.deserializeClient(function (id, callback) {
        Client.findOne({_id: id}, function (err, client) {
            if (err) {
                return callback(err);
            }
            return callback(null, client);
        });
    });

// Register authorization code grant type
    oauth2server.grant(oauth2orize.grant.code(function (client, redirectUri, user, ares, callback) {
        // Create a new authorization code
        var code = new Code({
            value: oauth2server.utils.uid(16),
            clientId: client._id,
            redirectUri: redirectUri,
            userId: user._id
        });

        // Save the auth code and check for errors
        code.save(function (err) {
            if (err) {
                return callback(err);
            }

            callback(null, code.value);
        });
    }));

// Exchange authorization codes for access tokens
    oauth2server.exchange(oauth2orize.exchange.code(function (client, code, redirectUri, callback) {
        Code.findOne({value: code}, function (err, authCode) {
            if (err) {
                return callback(err);
            }
            if (authCode === undefined || authCode === null) {
                return callback(null, false);
            }
            if (client._id.toString() !== authCode.clientId) {
                return callback(null, false);
            }
            if (redirectUri !== authCode.redirectUri) {
                return callback(null, false);
            }


            // Delete auth code now that it has been used
            authCode.remove(function (err, uid) {
                if (err) {
                    return callback(err);
                }

                // Create a new access token
                var token = new Token({
                    value: oauth2server.utils.uid(256),
                    clientId: authCode.clientId,
                    userId: authCode.userId
                });

                // Save the access token and check for errors
                token.save(function (err) {
                    if (err) {
                        return callback(err);
                    }

                    callback(null, token);
                });
            });
        });
    }));

    var endpoints = {};
// User authorization endpoint
    endpoints.authorization = [
        oauth2server.authorization(function (clientId, redirectUri, callback) {

            Client.findOne({id: clientId}, function (err, client) {
                if (err) {
                    return callback(err);
                }

                return callback(null, client, redirectUri);
            });
        }),
        function (req, res) {
            res.render('oauth2/dialog', {transactionID: req.oauth2.transactionID, user: req.user, client: req.oauth2.client});
        }
    ]

// User decision endpoint
    endpoints.decision = [
        oauth2server.decision()
    ]

// Application client token exchange endpoint
    endpoints.token = [
        oauth2server.token(),
        oauth2server.errorHandler()
    ]

    oauth2server.endpoints = endpoints;


    app.oauth2server = oauth2server;
};

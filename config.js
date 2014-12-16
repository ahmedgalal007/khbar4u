'use strict';

exports.port = process.env.PORT || 3000;
exports.mongodb = {
    uri: process.env.MONGOLAB_URI || process.env.MONGOHQ_URL || 'localhost/drywall'
};
exports.companyName = 'Khbar4u, Inc.';
exports.projectName = 'Khbar4u';
exports.systemEmail = 'khbar4u@gmail.com';
exports.cryptoKey = 'k3yb0ardc4t';
exports.loginAttempts = {
    forIp: 50,
    forIpAndUser: 7,
    logExpiration: '20m'
};
exports.requireAccountVerification = false;
exports.smtp = {
    from: {
        name: process.env.SMTP_FROM_NAME || exports.projectName + ' Website',
        address: process.env.SMTP_FROM_ADDRESS || 'khbar4u@gmail.com'
    },
    credentials: {
        user: process.env.SMTP_USERNAME || 'khbar4u@gmail.com',
        password: process.env.SMTP_PASSWORD || 'ahmashmoh',
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        ssl: true
    }
};
exports.oauth = {
    twitter: {
        key: process.env.TWITTER_OAUTH_KEY || '',
        secret: process.env.TWITTER_OAUTH_SECRET || ''
    },
    facebook: {
        key: process.env.FACEBOOK_OAUTH_KEY || '198615970246368',
        secret: process.env.FACEBOOK_OAUTH_SECRET || '21ad5757f37179226ceab0d1964e83c2'
    },
    github: {
        key: process.env.GITHUB_OAUTH_KEY || '',
        secret: process.env.GITHUB_OAUTH_SECRET || ''
    },
    google: {
        key: process.env.GOOGLE_OAUTH_KEY || '',
        secret: process.env.GOOGLE_OAUTH_SECRET || ''
    },
    tumblr: {
        key: process.env.TUMBLR_OAUTH_KEY || '',
        secret: process.env.TUMBLR_OAUTH_SECRET || ''
    },
    khbar4u: {
        key: process.env.TUMBLR_OAUTH_KEY || 'this_is_my_id',
        secret: process.env.TUMBLR_OAUTH_SECRET || 'this_is_my_secret'
    }
};

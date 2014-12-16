'use strict';

exports = module.exports = function (app, mongoose) {
    //embeddable docs first
    require('./schema/Note')(app, mongoose);
    require('./schema/Status')(app, mongoose);
    require('./schema/StatusLog')(app, mongoose);
    require('./schema/Category')(app, mongoose);

    //then regular docs
    require('./schema/User')(app, mongoose);
    require('./schema/Admin')(app, mongoose);
    require('./schema/AdminGroup')(app, mongoose);
    require('./schema/Account')(app, mongoose);
    require('./schema/LoginAttempt')(app, mongoose);

    //oauth2 docs
    require('./schema/Client')(app, mongoose);
    require('./schema/Code')(app, mongoose);
    require('./schema/Token')(app, mongoose);

};

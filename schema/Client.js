'use strict';
/**
 * Created by ahmedgalal on 11/7/14.
 */

exports = module.exports = function(app, mongoose) {
    // Define our client schema
    var clientSchema = new mongoose.Schema({
        name: {type: String, unique: true, required: true},
        id: {type: String, required: true},
        secret: {type: String, required: true},
        userId: {type: String, required: true}
    });
    app.db.model('Client', clientSchema);
};

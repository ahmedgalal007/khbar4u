/**
 * Created by ahmedgalal on 11/7/14.
 */

exports = module.exports = function(app, mongoose) {
// Define our code schema
    var codeSchema = new mongoose.Schema({
        value: {type: String, required: true},
        redirectUri: {type: String, required: true},
        userId: {type: String, required: true},
        clientId: {type: String, required: true}
    });
    app.db.model('Code', codeSchema);
}


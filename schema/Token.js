/**
 * Created by ahmedgalal on 11/7/14.
 */

exports = module.exports = function (app, mongoose) {
// Define our code schema
    var tokenSchema = new mongoose.Schema({
        value: {type: String, required: true},
        userId: {type: String, required: true},
        clientId: {type: String, required: true}
    });
    app.db.model('Token', tokenSchema);
}

const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    googleId: String,
    username: {
        type: String,
    },
    photo: String,
    mantra: {
        type: String,
    },
});

module.exports = mongoose.models.User || mongoose.model('User', UserSchema);

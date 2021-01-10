const mongoose = require('mongoose');

const MomentSchema = new mongoose.Schema(
    {
        _id: mongoose.Schema.Types.ObjectId,
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
    },
    { timestamps: true }
);

module.exports =
    mongoose.models.Moment || mongoose.model('Moment', MomentSchema);

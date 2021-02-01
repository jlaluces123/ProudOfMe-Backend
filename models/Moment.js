const mongoose = require('mongoose');
const User = require('../models/User');

const MomentSchema = new mongoose.Schema(
    {
        _id: mongoose.Schema.Types.ObjectId,
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        title: { type: String, required: true },
        story: { type: String, required: true },
        public: { type: Boolean, required: true },
    },
    { timestamps: true }
);

module.exports =
    mongoose.models.Moment || mongoose.model('Moment', MomentSchema);

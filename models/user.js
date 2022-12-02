const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
// Create user schema
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    slug: {
        type: String,
        required: true,
        trim: true,
    },
    money: {
        type: Number,
        required: true,
    },
    avatar: {
        type: String,
        required: true,
    },
    bankName: {
        type: String,
        required: false,
    },
    bankNumber: {
        type: String,
        required: false,
    }
}, { timestamps: true });

/**
 * @typedef User
 */
module.exports = mongoose.model('User', userSchema);
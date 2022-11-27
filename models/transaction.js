const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
// Create user schema
const transactionSchema = new mongoose.Schema({
    paidUserId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    // An array of unpaid users
    unpaidUsers: [{
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
        value: {
            type: Number,
            required: true,
        },
    }],
    totalValue: {
        type: Number,
        required: true,
    },
    description: {
        type: String,
        required: false,
    }
}, { timestamps: true });

/**
 * @typedef Transaction
 */
module.exports = mongoose.model('Transaction', transactionSchema);
const Transaction = require('../models/transaction');

exports.getAllTransactions = async (req, res) => {
    try {
        const transactions = await Transaction.find().populate('paidUserId').populate('unpaidUsers.userId');
        res.status(200).json(transactions);
    } catch (error) {
        res.status(500).json(error);
    }
};

exports.getTransactionById = async (req, res) => {
    try {
        const transaction = await Transaction.findById(req.params.id).populate('paidUserId').populate('unpaidUsers.userId');
        res.status(200).json(transaction);
    } catch (error) {
        res.status(500).json(error);
    }
}

exports.filter = async (req, res) => {
    try {
        const { paidUserId, unpaidUserId, from, to, description } = req.query;
        const query = {};
        if (paidUserId) {
            query.paidUserId = paidUserId;
        }
        if (unpaidUserId) {
            query.unpaidUsers = { $elemMatch: { userId: unpaidUserId } };
        }
        if (description) {
            query.description = { $regex: description, $options: 'i' };
        }

        if (from && to) {
            query.createdAt = { $gte: from, $lte: to };
        }
        
        const transactions = await Transaction.find
            (query)
            .populate('paidUserId')
            .populate('unpaidUsers.userId');

        res.status(200).json(transactions);
    } catch (error) {
        res.status(500).json(error);
    }
}
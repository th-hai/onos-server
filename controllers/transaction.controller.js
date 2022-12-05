const Transaction = require('../models/transaction');
const User = require('../models/user');

exports.getAllTransactions = async (req, res) => {
    try {
        const transactions = await Transaction.find().populate('paidUserId').populate('unpaidUsers.userId');

        const response = transactions.map((tran, index) => {
            const { paidUserId, unpaidUsers, totalValue, description, createdAt } = tran;
            const key = paidUserId.slug;
            const paidUser = {[key]: totalValue};

            unpaidUsers.forEach(unpaidUser => {
                const key = unpaidUser.userId.slug;
                paidUser[key] = -unpaidUser.value;
            });

            // Merge paidUser with unpaidUsers
            const result = {
                id: index,
                ...paidUser,
                description,
                createdAt,
            }

            return result;
        })

        res.status(200).json(response);
    } catch (error) {
        res.status(500).json(error);
    }
};

exports.getTransactionMonthly = async (req, res) => {
    try {

        // If from or to is not provided, return current month
        const date = new Date();
        const year = date.getFullYear();
        const month = date.getMonth();
        start = new Date(year, month, 1);
        end = new Date(year, month + 1, 0);
        
        const transactions = await Transaction.find({
            createdAt: {
                $gte: new Date(start).toISOString(),
                $lte: new Date(end).toISOString(),
            }
        }).populate('paidUserId').populate('unpaidUsers.userId');

        const response = transactions.map((tran, index) => {
            const { paidUserId, unpaidUsers, totalValue, description, createdAt } = tran;
            const key = paidUserId.slug;
            const paidUser = {[key]: totalValue};

            unpaidUsers.forEach(unpaidUser => {
                const key = unpaidUser.userId.slug;
                paidUser[key] = -unpaidUser.value;
            });

            // Merge paidUser with unpaidUsers
            const result = {
                id: index,
                ...paidUser,
                description,
                createdAt,
            }

            return result;
        })

        // Get total money usage and total money paid for each user
        const users = await User.find();
        const usersResponse = users.map((user, index) => {
            const { name, slug } = user;
            const totalMoneyUsage = response.reduce((acc, tran) => {
                // If the data is negative, it means the user not paid for this transaction
                if (tran[slug] && tran[slug] < 0) {
                    return acc + Math.abs(tran[slug]);
                } else {
                    return acc;
                };
            }, 0);

            const totalMoneyPaid = response.reduce((acc, tran) => {
                // If the data is positive, it means the user paid for this transaction
                if (tran[slug] && tran[slug] > 0) {
                    return acc + tran[slug];
                } else {
                    return acc;
                };
            }, 0);

            return {
                id: index,
                name,
                totalMoneyUsage: totalMoneyUsage * 1000,
                totalMoneyPaid: totalMoneyPaid * 1000,
            }
        });

        res.status(200).json(usersResponse);
    } catch (error) {
        console.log(error);
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
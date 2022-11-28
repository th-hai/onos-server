const User = require('../models/user');
const Transaction = require('../models/transaction');

exports.getAllUsers = async (req, res) => {
    try {
        res.header("Access-Control-Allow-Origin", "*");
        const users = await User.find();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json(error);
    }
};

exports.getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json(error);
    }
}

exports.createUser = async (req, res) => {
    try {
        const user = await User.create(req.body);
        res.status(201).json(user);
    } catch (error) {
        res.status(500).json(error);
    }
}

exports.updateUserMoney = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id
            , { $set: { money: req.body.money } }
            , { new: true });
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json(error);
    }
};

exports.updateUser = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id
            , { $set: { name: req.body.name, avatar: req.body.avatar, bankName: req.body.bankName, bankNumber: req.body.bankNumber } }
            , { new: true });
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json(error);
    }
}

exports.updateUserMoneyWithSameCost = async (req, res) => {
    try {
        const { paidUserId, sameValue, description } = req.body;
        if (!paidUserId || !sameValue || isNaN(sameValue)) {
            res.status(400).json({ message: 'Invalid request' });
            return false;
        }

        const paidUser = await User.findOne({ _id: paidUserId });

        const users = await User.find({ _id: { $ne: paidUserId } });
        const totalIncreasedMoney = sameValue * users.length;

        const unpaidUsers = users.map(user => {
            return {
                userId: user._id,
                value: sameValue
            }
        })

        // Save transaction
        const transaction = await Transaction.create({
            paidUserId,
            unpaidUsers,
            totalValue: totalIncreasedMoney,
            description: description || `${paidUser.name} trả tiền!`
        });

        // Increase money of paid user
        const paidUserUpdated = await User.findOneAndUpdate({_id: paidUserId}, { $inc: { money: totalIncreasedMoney } }, { new: true });

        // Decrease money of unpaid users
        const unpaidUsersUpdated = await User.updateMany({ _id: { $ne: paidUserId } }, { $inc: { money: -sameValue } });

        console.log(paidUserUpdated, unpaidUsersUpdated);
        res.status(200).json(users);
    }
    catch (error) {
        res.status(500).json(error);
    }
}

exports.bulkUpdateUserMoney = async (req, res) => {
    try {
        const { paidUserId, unpaidUsers, description } = req.body;

        if (!paidUserId || !unpaidUsers || unpaidUsers.length === 0) {
            res.status(400).json({ message: 'Invalid request' });
            return false;
        };

        const totalIncreasedMoney = unpaidUsers.reduce((acc, user) => {
            return acc + user.money;
        }, 0);

        const paidUser = await User.findOne({ _id: paidUserId });

        // Increase money of paid user
        const paidUserUpdated = await User.findOneAndUpdate({_id: paidUserId}, { $inc: { money: totalIncreasedMoney } }, { new: true });

        const bulkBody = unpaidUsers.map(user => {
            return {
                updateOne: {
                    filter: { _id: user.id
                    },
                    update: { $inc: { money: -user.money } }
                }
            }
        });

        const unpaidUsersUpdated = await User.bulkWrite(bulkBody);

        if (unpaidUsersUpdated && unpaidUsersUpdated.nModified > 0) {
            // Save transaction
            const upUsers = unpaidUsers.map(user => {
                return {
                    userId: user.id,
                    value: user.money
                }
            })

            const transaction = await Transaction.create({
                paidUserId,
                unpaidUsers: upUsers,
                totalValue: totalIncreasedMoney,
                description: description || `${paidUser.name} trả tiền!`
            });

            res.status(200).json(transaction);
        }

        res.status(200).json(users);
    } catch (error) {
        console.log(error)
        res.status(500).json(error);
    }
}

exports.userFilter = async (req, res) => {
    try {
        const { name } = req.query;
        const users = await User.find({ name: { $regex: name, $options: 'i' } });
        res.status(200).json(users);
        
    } catch (error) {
        res.status(500).json(error);
    }
}
const express = require('express');
const { getAllUsers, getUserById, createUser, bulkUpdateUserMoney, updateUserMoneyWithSameCost, userFilter } = require('../controllers/user.controller');
const { getAllTransactions, getTransactionById, filter } = require('../controllers/transaction.controller');

const router = express.Router();

router.get('/users', getAllUsers);
router.get('/users/:id', getUserById);
router.post('/users', createUser);

// router.put('/users/money/:id', updateUserMoney);
router.post('/users/money', bulkUpdateUserMoney);
router.post('/users/money/all', updateUserMoneyWithSameCost);
router.get('/users/search/name', userFilter);

// Transaction
router.get('/transactions', getAllTransactions);
router.get('/transactions/:id', getTransactionById);
router.get('/transactions/filter', filter);


module.exports = router;
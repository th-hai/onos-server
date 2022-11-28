const express = require('express');
const { setHeaders } = require('../middlewares/header.middleware');
const { getAllUsers, getUserById, createUser, bulkUpdateUserMoney, updateUserMoneyWithSameCost, userFilter } = require('../controllers/user.controller');
const { getAllTransactions, getTransactionById, filter } = require('../controllers/transaction.controller');

const router = express.Router();

router.get('/users', setHeaders, getAllUsers);
router.get('/users/:id', getUserById);
router.post('/users', createUser);

// router.put('/users/money/:id', updateUserMoney);
router.post('/users/money', setHeaders, bulkUpdateUserMoney);
router.post('/users/money/all', setHeaders, updateUserMoneyWithSameCost);
router.get('/users/search/name', setHeaders, userFilter);

// Transaction
router.get('/transactions', setHeaders, getAllTransactions);
router.get('/transactions/:id', setHeaders, getTransactionById);
router.get('/transactions/filter', setHeaders, filter);


module.exports = router;
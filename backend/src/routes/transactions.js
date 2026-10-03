const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');
const { verifyToken } = require('../middleware/auth');
const { requireRole } = require('../middleware/roleGuard');

router.post('/', verifyToken, transactionController.createTransaction);
router.get('/my', verifyToken, transactionController.getUserTransactions);
router.get('/', verifyToken, requireRole('seller', 'agent', 'admin'), transactionController.getAllTransactions);

module.exports = router;

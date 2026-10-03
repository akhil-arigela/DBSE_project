const Transaction = require('../models/transactionModel');

exports.createTransaction = async (req, res, next) => {
  try {
    const transactionId = await Transaction.create(req.body);
    res.status(201).json({ success: true, message: 'Transaction created', data: { transaction_id: transactionId } });
  } catch (error) {
    next(error);
  }
};

exports.getUserTransactions = async (req, res, next) => {
  try {
    const transactions = await Transaction.findByBuyer(req.user.user_id);
    res.status(200).json({ success: true, data: transactions });
  } catch (error) {
    next(error);
  }
};

exports.getAllTransactions = async (req, res, next) => {
  try {
    const transactions = await Transaction.findAll();
    res.status(200).json({ success: true, data: transactions });
  } catch (error) {
    next(error);
  }
};

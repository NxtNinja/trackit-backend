const repo = require("../repositories/transaction.repository");

const addTransaction = async (userId, data) => {
  return repo.createTransaction({ ...data, userId });
};

const updateTransaction = async (userId, id, data) => {
  return repo.updateTransaction(id, userId, data);
};

const deleteTransaction = async (userId, id) => {
  return repo.deleteTransaction(id, userId);
};

const getTransactions = async (userId, filters) => {
  return repo.getUserTransactions(userId, filters);
};

module.exports = {
  addTransaction,
  getTransactions,
  updateTransaction,
  deleteTransaction,
};

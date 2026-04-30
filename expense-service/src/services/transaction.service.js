const repo = require("../repositories/transaction.repository");
const AppError = require("../utils/AppError");

const addTransaction = async (userId, data) => {
  return repo.createTransaction({ ...data, userId });
};

const updateTransaction = async (userId, id, data) => {
  const updated = await repo.updateTransaction(id, userId, data);
  if (!updated) {
    throw new AppError("Transaction not found", 404);
  }
  return updated;
};

const deleteTransaction = async (userId, id) => {
  // Check if it exists first so we can throw 404 if missing
  const existing = await repo.getById(id, userId);
  if (!existing) {
    throw new AppError("Transaction not found", 404);
  }
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

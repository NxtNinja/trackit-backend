const txnRepo = require("../repositories/transaction.repository");
const recurringRepo = require("../repositories/recurring.repository");
const AppError = require("../utils/AppError");

const createFromTransaction = async (userId, transactionId, frequency) => {
  const txn = await txnRepo.getById(transactionId, userId);

  if (!txn) {
    throw new AppError("Transaction not found", 404);
  }

  const recurring = await recurringRepo.createRecurring({
    userId,
    categoryId: txn.category_id,
    type: txn.type,
    amount: txn.amount,
    description: txn.description,
    frequency,
    startDate: txn.date,
  });

  await txnRepo.linkRecurring(transactionId, recurring.id);

  return recurring;
};

const deleteRecurring = async (userId, id) => {
  return recurringRepo.deleteRecurring(id, userId);
};

const getUserRecurring = async (userId) => {
  return recurringRepo.getUserRecurring(userId);
};

module.exports = {
  createFromTransaction,
  deleteRecurring,
  getUserRecurring,
};

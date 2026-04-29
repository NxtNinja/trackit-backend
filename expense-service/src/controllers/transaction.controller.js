const service = require("../services/transaction.service");
const { successResponse } = require("../utils/response");
const AppError = require("../utils/AppError");

const addTransaction = async (req, res, next) => {
  try {
    const userId = req.headers["x-user-id"];

    if (!userId) {
      throw new AppError("Unauthorized", 401);
    }

    const transaction = await service.addTransaction(userId, req.body);

    return successResponse(res, transaction, "Transaction added successfully");
  } catch (err) {
    next(err);
  }
};

const updateTransaction = async (req, res, next) => {
  try {
    const userId = req.headers["x-user-id"];
    const { id } = req.params;

    const updated = await service.updateTransaction(userId, id, req.body);

    return successResponse(res, updated, "Transaction updated successfully");
  } catch (err) {
    next(err);
  }
};

const deleteTransaction = async (req, res, next) => {
  try {
    const userId = req.headers["x-user-id"];
    const { id } = req.params;

    await service.deleteTransaction(userId, id);

    return successResponse(res, null, "Deleted successfully");
  } catch (err) {
    next(err);
  }
};

const getTransactions = async (req, res, next) => {
  try {
    const userId = req.headers["x-user-id"];

    const transactions = await service.getTransactions(userId, req.query);

    return successResponse(res, transactions, "Transactions fetched successfully");
  } catch (err) {
    next(err);
  }
};

module.exports = {
  addTransaction,
  updateTransaction,
  deleteTransaction,
  getTransactions,
};

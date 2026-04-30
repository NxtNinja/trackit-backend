const service = require("../services/recurring.service");
const { successResponse } = require("../utils/response");
const AppError = require("../utils/AppError");

const createFromTransaction = async (req, res, next) => {
  try {
    const userId = req.headers["x-user-id"];
    const { id } = req.params;
    const { frequency } = req.body;

    if (!userId) {
      throw new AppError("Unauthorized", 401);
    }

    const recurring = await service.createFromTransaction(
      userId,
      id,
      frequency,
    );

    return successResponse(res, recurring, "Recurring expense setup successfully");
  } catch (err) {
    next(err);
  }
};

const getUserRecurring = async (req, res, next) => {
  try {
    const userId = req.headers["x-user-id"];
    if (!userId) {
      throw new AppError("Unauthorized", 401);
    }

    const data = await service.getUserRecurring(userId);
    return successResponse(res, data, "Recurring transactions fetched successfully");
  } catch (err) {
    next(err);
  }
};

const deleteRecurring = async (req, res, next) => {
  try {
    const userId = req.headers["x-user-id"];
    const { id } = req.params;

    if (!userId) {
      throw new AppError("Unauthorized", 401);
    }

    await service.deleteRecurring(userId, id);
    return successResponse(res, null, "Recurring transaction deleted successfully");
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createFromTransaction,
  getUserRecurring,
  deleteRecurring,
};

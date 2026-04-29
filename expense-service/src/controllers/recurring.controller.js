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

module.exports = {
  createFromTransaction,
};

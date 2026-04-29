const service = require("../services/analytics.service");
const AppError = require("../utils/AppError");
const { successResponse } = require("../utils/response");

const getSummary = async (req, res, next) => {
  try {
    const userId = req.headers["x-user-id"];

    if (!userId) {
      throw new AppError("Unauthorized", 401);
    }

    const data = await service.getSummary(userId, req.query);

    return successResponse(res, data, "Summary fetched successfully");
  } catch (err) {
    next(err);
  }
};

const getCategoryWise = async (req, res, next) => {
  try {
    const userId = req.headers["x-user-id"];

    if (!userId) {
      throw new AppError("Unauthorized", 401);
    }

    const data = await service.getCategoryWise(userId, req.query);

    return successResponse(res, data, "Category-wise analytics fetched successfully");
  } catch (err) {
    next(err);
  }
};

const getMonthlyTrends = async (req, res, next) => {
  try {
    const userId = req.headers["x-user-id"];

    if (!userId) {
      throw new AppError("Unauthorized", 401);
    }

    const data = await service.getMonthlyTrends(userId);

    return successResponse(res, data, "Monthly trends fetched successfully");
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getSummary,
  getCategoryWise,
  getMonthlyTrends,
};

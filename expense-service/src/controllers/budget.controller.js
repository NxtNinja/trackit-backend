const service = require("../services/budget.service");
const AppError = require("../utils/AppError");
const { successResponse } = require("../utils/response");

const createBudget = async (req, res, next) => {
  try {
    const userId = req.headers["x-user-id"];

    if (!userId) {
      throw new AppError("Unauthorized", 401);
    }

    const budget = await service.createBudget(userId, req.body);

    return successResponse(res, budget, "Budget created successfully");
  } catch (err) {
    next(err);
  }
};

const getBudgets = async (req, res, next) => {
  try {
    const userId = req.headers["x-user-id"];

    if (!userId) {
      throw new AppError("Unauthorized", 401);
    }

    const budgets = await service.getBudgets(userId);

    return successResponse(res, budgets, "Budgets fetched successfully");
  } catch (err) {
    next(err);
  }
};

const getBudgetUsage = async (req, res, next) => {
  try {
    const userId = req.headers["x-user-id"];

    if (!userId) {
      throw new AppError("Unauthorized", 401);
    }

    const now = new Date();

    const year = parseInt(req.query.year, 10) || now.getFullYear();
    const month = parseInt(req.query.month, 10) || now.getMonth() + 1;

    const data = await service.getBudgetUsage(userId, { year, month });

    return successResponse(res, data, "Budget usage fetched successfully");
  } catch (err) {
    next(err);
  }
};

const updateBudget = async (req, res, next) => {
  try {
    const userId = req.headers["x-user-id"];
    const { id } = req.params;

    if (!userId) {
      throw new AppError("Unauthorized", 401);
    }

    const budget = await service.updateBudget(userId, id, req.body);

    return successResponse(res, budget, "Budget updated successfully");
  } catch (err) {
    next(err);
  }
};

const deleteBudget = async (req, res, next) => {
  try {
    const userId = req.headers["x-user-id"];
    const { id } = req.params;

    if (!userId) {
      throw new AppError("Unauthorized", 401);
    }

    await service.deleteBudget(userId, id);

    return successResponse(res, null, "Budget deleted successfully");
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createBudget,
  getBudgets,
  getBudgetUsage,
  updateBudget,
  deleteBudget,
};
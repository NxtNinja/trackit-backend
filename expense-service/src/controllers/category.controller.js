const service = require("../services/category.service");
const AppError = require("../utils/AppError");
const { successResponse } = require("../utils/response");

const getCategories = async (req, res, next) => {
  try {
    const userId = req.headers["x-user-id"];

    if (!userId) {
      throw new AppError("Unauthorized", 401);
    }

    const categories = await service.getCategories(userId);

    return successResponse(res, categories, "Categories fetched successfully");
  } catch (err) {
    next(err);
  }
};

const createCategory = async (req, res, next) => {
  try {
    const userId = req.headers["x-user-id"];

    if (!userId) {
      throw new AppError("Unauthorized", 401);
    }

    const category = await service.createCategory(userId, req.body);

    return successResponse(res, category, "Category created successfully");
  } catch (err) {
    next(err);
  }
};

const deleteCategory = async (req, res, next) => {
  try {
    const userId = req.headers["x-user-id"];

    if (!userId) {
      throw new AppError("Unauthorized", 401);
    }
    
    const { id } = req.params;

    await service.deleteCategory(userId, id);

    return successResponse(res, null, "Category deleted successfully");
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getCategories,
  createCategory,
  deleteCategory,
};
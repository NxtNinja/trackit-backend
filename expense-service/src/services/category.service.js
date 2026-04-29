const repo = require("../repositories/category.repository");
const AppError = require("../utils/AppError");

const getCategories = async (userId) => {
  return repo.getCategories(userId);
};

const createCategory = async (userId, data) => {
  return repo.createCategory({ userId, ...data });
};

const deleteCategory = async (userId, id) => {
  const deleted = await repo.deleteCategory(id, userId);

  if (!deleted) {
    throw new AppError("Category not found or not allowed", 400);
  }

  return deleted;
};

module.exports = {
  getCategories,
  createCategory,
  deleteCategory,
};
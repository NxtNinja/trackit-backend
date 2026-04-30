const repo = require("../repositories/budget.repository");
const AppError = require("../utils/AppError");

const createBudget = async (userId, data) => {
  return repo.createBudget({ userId, ...data });
};

const getBudgets = async (userId) => {
  return repo.getBudgets(userId);
};

const getBudgetUsage = async (userId, { year, month }) => {
  const data = await repo.getBudgetUsage(userId, { year, month });

  return data.map((row) => {
    const budget = Number(row.budget);
    const spent = Number(row.spent);

    const remaining = budget - spent;
    const percentageUsed = budget > 0 ? (spent / budget) * 100 : 0;

    return {
      id: row.id,
      category: row.category,
      budget,
      spent,
      remaining,
      percentageUsed: Math.round(percentageUsed),
      period: row.period,
      startDate: row.start_date,
    };
  });
};

const updateBudget = async (userId, id, data) => {
  const updated = await repo.updateBudget(id, userId, data);
  if (!updated) {
    throw new AppError("Budget not found", 404);
  }
  return updated;
};

const deleteBudget = async (userId, id) => {
  // Check existence first
  const existing = await repo.getBudgets(userId);
  const exists = existing.find(b => b.id === id);
  if (!exists) {
    throw new AppError("Budget not found", 404);
  }
  return repo.deleteBudget(id, userId);
};

module.exports = {
  createBudget,
  getBudgets,
  getBudgetUsage,
  updateBudget,
  deleteBudget,
};
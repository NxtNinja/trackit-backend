const repo = require("../repositories/budget.repository");

const createBudget = async (userId, data) => {
  return repo.createBudget({ userId, ...data });
};

const getBudgets = async (userId) => {
  return repo.getBudgets(userId);
};

const getBudgetUsage = async (userId) => {
  const data = await repo.getBudgetUsage(userId);

  return data.map((row) => {
    const budget = Number(row.budget);
    const spent = Number(row.spent);

    const remaining = budget - spent;
    const percentageUsed = budget > 0 ? (spent / budget) * 100 : 0;

    return {
      category: row.category,
      budget,
      spent,
      remaining,
      percentageUsed: Math.round(percentageUsed),
    };
  });
};

module.exports = {
  createBudget,
  getBudgets,
  getBudgetUsage,
};
const repo = require("../repositories/analytics.repository");

const getSummary = async (userId, filters) => {
  const data = await repo.getSummary(userId, filters);

  const totalIncome = Number(data.total_income) || 0;
  const totalExpense = Number(data.total_expense) || 0;

  return {
    totalIncome,
    totalExpense,
    balance: totalIncome - totalExpense,
  };
};

const getCategoryWise = async (userId, filters) => {
  return repo.getCategoryWise(userId, filters);
};

const getMonthlyTrends = async (userId) => {
  const data = await repo.getMonthlyTrends(userId);

  return data.map((row) => ({
    month: row.month,
    income: Number(row.income) || 0,
    expense: Number(row.expense) || 0,
  }));
};

module.exports = {
  getSummary,
  getCategoryWise,
  getMonthlyTrends,
};

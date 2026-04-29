const pool = require("../config/db");

const createBudget = async (data) => {
  const { userId, categoryId, amount, period, startDate } = data;

  const result = await pool.query(
    `INSERT INTO budgets (user_id, category_id, amount, period, start_date)
     VALUES ($1,$2,$3,$4,$5)
     RETURNING *`,
    [userId, categoryId, amount, period, startDate]
  );

  return result.rows[0];
};

const getBudgets = async (userId) => {
  const result = await pool.query(
    `SELECT * FROM budgets WHERE user_id = $1`,
    [userId]
  );

  return result.rows;
};

const getBudgetUsage = async (userId) => {
  const result = await pool.query(
    `
    SELECT 
      b.id,
      b.amount AS budget,
      b.period,
      b.start_date,
      c.name AS category,

      COALESCE(SUM(t.amount), 0) AS spent

    FROM budgets b

    LEFT JOIN transactions t 
      ON t.category_id = b.category_id
      AND t.user_id = b.user_id
      AND t.type = 'expense'
      AND t.date >= b.start_date

    JOIN categories c 
      ON c.id = b.category_id

    WHERE b.user_id = $1

    GROUP BY b.id, c.name
    `,
    [userId]
  );

  return result.rows;
};

module.exports = {
  createBudget,
  getBudgets,
  getBudgetUsage
};
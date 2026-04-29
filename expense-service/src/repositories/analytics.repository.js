const pool = require("../config/db");

// 🔹 Summary (income, expense, balance)
const getSummary = async (userId, { startDate, endDate }) => {
  let query = `
    SELECT 
      SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) AS total_income,
      SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) AS total_expense
    FROM transactions
    WHERE user_id = $1
  `;

  const values = [userId];
  let index = 2;

  if (startDate) {
    query += ` AND date >= $${index++}`;
    values.push(startDate);
  }

  if (endDate) {
    query += ` AND date <= $${index++}`;
    values.push(endDate);
  }

  const result = await pool.query(query, values);
  return result.rows[0];
};

// 🔹 Category-wise breakdown
const getCategoryWise = async (userId, { startDate, endDate }) => {
  let query = `
    SELECT 
      c.name,
      c.type,
      SUM(t.amount) AS total
    FROM transactions t
    JOIN categories c ON t.category_id = c.id
    WHERE t.user_id = $1
  `;

  const values = [userId];
  let index = 2;

  if (startDate) {
    query += ` AND t.date >= $${index++}`;
    values.push(startDate);
  }

  if (endDate) {
    query += ` AND t.date <= $${index++}`;
    values.push(endDate);
  }

  query += `
    GROUP BY c.name, c.type
    ORDER BY total DESC
  `;

  const result = await pool.query(query, values);
  return result.rows;
};

const getMonthlyTrends = async (userId) => {
  const result = await pool.query(
    `
    SELECT 
      TO_CHAR(date, 'YYYY-MM') AS month,
      SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) AS income,
      SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) AS expense
    FROM transactions
    WHERE user_id = $1
    GROUP BY month
    ORDER BY month ASC
    `,
    [userId]
  );

  return result.rows;
};

module.exports = {
  getSummary,
  getCategoryWise,
  getMonthlyTrends,
};

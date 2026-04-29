const pool = require("../config/db");

const createRecurring = async (data) => {
  const {
    userId,
    categoryId,
    type,
    amount,
    description,
    frequency,
    startDate,
  } = data;

  const result = await pool.query(
    `INSERT INTO recurring_transactions
    (user_id, category_id, type, amount, description, frequency, start_date)
    VALUES ($1,$2,$3,$4,$5,$6,$7)
    RETURNING *`,
    [userId, categoryId, type, amount, description, frequency, startDate],
  );

  return result.rows[0];
};

const getActiveRecurring = async () => {
  const result = await pool.query(
    `SELECT * FROM recurring_transactions`
  );
  return result.rows;
};

const updateLastRun = async (id, client = pool) => {
  await client.query(
    `UPDATE recurring_transactions SET last_run = NOW() WHERE id = $1`,
    [id]
  );
};

module.exports = {
  createRecurring,
  getActiveRecurring,
  updateLastRun,
};

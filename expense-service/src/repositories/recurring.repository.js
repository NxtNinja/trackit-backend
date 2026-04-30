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

const getUserRecurring = async (userId) => {
  const result = await pool.query(
    `SELECT rt.*, c.name as category_name
     FROM recurring_transactions rt
     LEFT JOIN categories c ON rt.category_id = c.id
     WHERE rt.user_id = $1
     ORDER BY rt.created_at DESC`,
    [userId]
  );
  return result.rows;
};

const deleteRecurring = async (id, userId) => {
  await pool.query(
    `DELETE FROM recurring_transactions WHERE id = $1 AND user_id = $2`,
    [id, userId]
  );
};

module.exports = {
  createRecurring,
  getActiveRecurring,
  updateLastRun,
  getUserRecurring,
  deleteRecurring,
};

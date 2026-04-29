const pool = require("../config/db");

const createTransaction = async (data) => {
  const { userId, type, amount, categoryId, description, date } = data;

  const result = await pool.query(
    `INSERT INTO transactions 
    (user_id, type, amount, category_id, description, date)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *`,
    [userId, type, amount, categoryId, description, date],
  );

  return result.rows[0];
};

const getUserTransactions = async (userId, filters) => {
  const page = parseInt(filters.page, 10) || 1;
  const limit = parseInt(filters.limit, 10) || 10;
  const offset = (page - 1) * limit;

  let baseQuery = `FROM transactions t LEFT JOIN categories c ON t.category_id = c.id WHERE t.user_id = $1`;
  let values = [userId];
  let index = 2;

  if (filters.type) {
    baseQuery += ` AND t.type = $${index++}`;
    values.push(filters.type);
  }

  if (filters.categoryId) {
    baseQuery += ` AND t.category_id = $${index++}`;
    values.push(filters.categoryId);
  }

  if (filters.startDate) {
    baseQuery += ` AND t.date >= $${index++}`;
    values.push(filters.startDate);
  }

  if (filters.endDate) {
    baseQuery += ` AND t.date <= $${index++}`;
    values.push(filters.endDate);
  }

  // Count total records
  const countQuery = `SELECT COUNT(*) ${baseQuery}`;
  const countResult = await pool.query(countQuery, values);
  const total = parseInt(countResult.rows[0].count, 10);

  // Fetch paginated records with category name
  let dataQuery = `SELECT t.*, c.name as category_name ${baseQuery} ORDER BY t.date DESC, t.created_at DESC`;
  dataQuery += ` LIMIT $${index++} OFFSET $${index++}`;
  const dataValues = [...values, limit, offset];

  const result = await pool.query(dataQuery, dataValues);
  
  return {
    transactions: result.rows,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit)
  };
};

const updateTransaction = async (id, userId, data) => {
  const { type, amount, categoryId, description, date } = data;

  const result = await pool.query(
    `UPDATE transactions
     SET type=$1, amount=$2, category_id=$3, description=$4, date=$5
     WHERE id=$6 AND user_id=$7
     RETURNING *`,
    [type, amount, categoryId, description, date, id, userId],
  );

  return result.rows[0];
};

const deleteTransaction = async (id, userId) => {
  await pool.query(`DELETE FROM transactions WHERE id=$1 AND user_id=$2`, [
    id,
    userId,
  ]);
};

const getById = async (id, userId) => {
  const result = await pool.query(
    `SELECT * FROM transactions WHERE id=$1 AND user_id=$2`,
    [id, userId],
  );

  return result.rows[0];
};

const linkRecurring = async (transactionId, recurringId) => {
  await pool.query(`UPDATE transactions SET recurring_id=$1 WHERE id=$2`, [
    recurringId,
    transactionId,
  ]);
};

const createFromRecurring = async (data, client = pool) => {
  const { userId, type, amount, categoryId, description, date, recurringId } = data;

  const result = await client.query(
    `INSERT INTO transactions 
    (user_id, type, amount, category_id, description, date, recurring_id)
    VALUES ($1,$2,$3,$4,$5,$6,$7)
    RETURNING *`,
    [userId, type, amount, categoryId, description, date, recurringId]
  );

  return result.rows[0];
};

module.exports = {
  createTransaction,
  getUserTransactions,
  updateTransaction,
  deleteTransaction,
  getById,
  linkRecurring,
  createFromRecurring,
};

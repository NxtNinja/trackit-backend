const pool = require("../config/db");

const getCategories = async (userId) => {
  const result = await pool.query(
    `SELECT * FROM categories
     WHERE user_id IS NULL OR user_id = $1
     ORDER BY created_at ASC`,
    [userId]
  );

  return result.rows;
};

const createCategory = async ({ userId, name, type }) => {
  const result = await pool.query(
    `INSERT INTO categories (user_id, name, type)
     VALUES ($1, $2, $3)
     RETURNING *`,
    [userId, name, type]
  );

  return result.rows[0];
};

const deleteCategory = async (id, userId) => {
  const result = await pool.query(
    `DELETE FROM categories
     WHERE id = $1 AND user_id = $2
     RETURNING *`,
    [id, userId]
  );

  return result.rows[0];
};

module.exports = {
  getCategories,
  createCategory,
  deleteCategory,
};
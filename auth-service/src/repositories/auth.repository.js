const pool = require("../config/db");

const createUser = async (name, email, passwordHash) => {
  const result = await pool.query(
    "INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING *",
    [name, email, passwordHash],
  );
  return result.rows[0];
};

const findUserByEmail = async (email) => {
  const result = await pool.query("SELECT * FROM users WHERE email = $1", [
    email,
  ]);
  return result.rows[0];
};

const getUserById = async (id) => {
  const result = await pool.query(
    "SELECT id, name, email, created_at FROM users WHERE id = $1",
    [id],
  );

  return result.rows[0];
};

const saveRefreshToken = async (userId, token, expiresAt) => {
  await pool.query(
    "INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES ($1, $2, $3)",
    [userId, token, expiresAt],
  );
};

const findRefreshToken = async (token) => {
  const result = await pool.query(
    "SELECT * FROM refresh_tokens WHERE token = $1 AND expires_at > NOW()",
    [token],
  );
  return result.rows[0];
};

const deleteRefreshToken = async (token) => {
  await pool.query("DELETE FROM refresh_tokens WHERE token = $1", [token]);
};

const deleteUserRefreshTokens = async (userId) => {
  await pool.query("DELETE FROM refresh_tokens WHERE user_id = $1", [userId]);
};

const deleteExpiredUserTokens = async (userId) => {
  await pool.query(
    "DELETE FROM refresh_tokens WHERE user_id = $1 AND expires_at < NOW()",
    [userId],
  );
};

module.exports = {
  createUser,
  findUserByEmail,
  getUserById,
  saveRefreshToken,
  findRefreshToken,
  deleteRefreshToken,
  deleteUserRefreshTokens,
  deleteExpiredUserTokens,
};

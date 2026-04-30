const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const authRepo = require("../repositories/auth.repository");
const AppError = require("../utils/AppError");

const signup = async ({ name, email, password }) => {
  const existing = await authRepo.findUserByEmail(email);
  if (existing) {
    throw new AppError("User already exists", 400);
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await authRepo.createUser(name, email, hashedPassword);

  return user;
};

const login = async ({ email, password }) => {
  const user = await authRepo.findUserByEmail(email);

  if (!user) {
    throw new AppError("Invalid email or password", 401);
  }

  const isMatch = await bcrypt.compare(password, user.password_hash);

  if (!isMatch) {
    throw new AppError("Invalid email or password", 401);
  }

  const accessToken = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
    expiresIn: "15m",
  });

  const refreshToken = jwt.sign(
    { userId: user.id },
    process.env.JWT_REFRESH_SECRET,
    {
      expiresIn: "7d",
    },
  );

  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7);

  // Clean up expired tokens for this user
  await authRepo.deleteExpiredUserTokens(user.id);

  await authRepo.saveRefreshToken(user.id, refreshToken, expiresAt);

  return { accessToken, refreshToken, user };
};

const refreshTokens = async (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    const storedToken = await authRepo.findRefreshToken(token);

    if (!storedToken) {
      throw new AppError("Invalid refresh token", 401);
    }

    const user = await authRepo.getUserById(decoded.userId);
    if (!user) {
      throw new AppError("User not found", 404);
    }

    const accessToken = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: "15m",
    });

    const newRefreshToken = jwt.sign(
      { userId: user.id },
      process.env.JWT_REFRESH_SECRET,
      {
        expiresIn: "7d",
      },
    );

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    // Rotate refresh token (optional but recommended for security)
    await authRepo.deleteRefreshToken(token);
    await authRepo.saveRefreshToken(user.id, newRefreshToken, expiresAt);

    return { accessToken, refreshToken: newRefreshToken };
  } catch (err) {
    throw new AppError("Invalid or expired refresh token", 401);
  }
};

const logout = async (userId, token) => {
  if (token) {
    await authRepo.deleteRefreshToken(token);
  } else {
    await authRepo.deleteUserRefreshTokens(userId);
  }
};

const getCurrentUser = async (userId) => {
  const user = await authRepo.getUserById(userId);

  if (!user) {
    throw new AppError("User not found", 404);
  }

  return user;
};

const updateProfile = async (userId, { name, email }) => {
  const user = await authRepo.getUserById(userId);
  if (!user) {
    throw new AppError("User not found", 404);
  }

  if (email && email !== user.email) {
    const existing = await authRepo.findUserByEmail(email);
    if (existing) {
      throw new AppError("Email already in use", 400);
    }
  }

  const payload = {};
  if (name) payload.name = name;
  if (email) payload.email = email;

  const updated = await authRepo.updateUser(userId, payload);
  return updated;
};

const updatePassword = async (userId, { currentPassword, newPassword }) => {
  const user = await authRepo.findUserByIdFull(userId);
  if (!user) {
    throw new AppError("User not found", 404);
  }

  const isMatch = await bcrypt.compare(currentPassword, user.password_hash);
  if (!isMatch) {
    throw new AppError("Current password is incorrect", 400);
  }

  const isSamePassword = await bcrypt.compare(newPassword, user.password_hash);
  if (isSamePassword) {
    throw new AppError("New password cannot be the same as current password", 400);
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  await authRepo.updateUser(userId, { password_hash: hashedPassword });
};

module.exports = {
  signup,
  login,
  refreshTokens,
  logout,
  getCurrentUser,
  updateProfile,
  updatePassword,
};

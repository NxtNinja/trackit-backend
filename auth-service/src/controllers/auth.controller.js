const authService = require("../services/auth.service");
const sanitizeUser = require("../utils/sanitize");
const { successResponse } = require("../utils/response");
const AppError = require("../utils/AppError");

const signup = async (req, res, next) => {
  try {
    const user = await authService.signup(req.body);

    return successResponse(
      res,
      sanitizeUser(user),
      "User created successfully",
    );
  } catch (err) {
    next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const { accessToken, refreshToken } = await authService.login(req.body);

    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Strict",
    };

    res.cookie("token", accessToken, {
      ...cookieOptions,
      maxAge: 15 * 60 * 1000,
    });

    res.cookie("refreshToken", refreshToken, {
      ...cookieOptions,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return successResponse(res, null, "Logged in successfully");
  } catch (err) {
    next(err);
  }
};

const logout = async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    // Priority: Gateway Header > Local req.user
    const userId = req.headers["x-user-id"] || (req.user && req.user.userId);

    await authService.logout(userId, refreshToken);

    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Strict",
    };

    res.clearCookie("token", cookieOptions);
    res.clearCookie("refreshToken", cookieOptions);

    return successResponse(res, null, "Logged out successfully");
  } catch (err) {
    next(err);
  }
};

const refresh = async (req, res, next) => {
  try {
    const token = req.cookies.refreshToken;

    if (!token) {
      throw new AppError("Refresh token required", 401);
    }

    const { accessToken, refreshToken: newRefreshToken } =
      await authService.refreshTokens(token);

    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Strict",
    };

    res.cookie("token", accessToken, {
      ...cookieOptions,
      maxAge: 15 * 60 * 1000,
    });

    res.cookie("refreshToken", newRefreshToken, {
      ...cookieOptions,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return successResponse(res, null, "Token refreshed successfully");
  } catch (err) {
    // Clear cookies on refresh failure to prevent infinite loops in the frontend
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Strict",
    };
    res.clearCookie("token", cookieOptions);
    res.clearCookie("refreshToken", cookieOptions);
    next(err);
  }
};

const getCurrentUser = async (req, res, next) => {
  try {
    // Priority: Gateway Header > Local req.user
    const userId = req.headers["x-user-id"] || (req.user && req.user.userId);

    if (!userId) {
      throw new AppError("User identity not found", 401);
    }

    const user = await authService.getCurrentUser(userId);
    return successResponse(
      res,
      sanitizeUser(user),
      "User fetched successfully",
    );
  } catch (err) {
    next(err);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const userId = req.headers["x-user-id"] || (req.user && req.user.userId);
    const updated = await authService.updateProfile(userId, req.body);
    return successResponse(res, sanitizeUser(updated), "Profile updated successfully");
  } catch (err) {
    next(err);
  }
};

const updatePassword = async (req, res, next) => {
  try {
    const userId = req.headers["x-user-id"] || (req.user && req.user.userId);
    await authService.updatePassword(userId, req.body);
    return successResponse(res, null, "Password updated successfully");
  } catch (err) {
    next(err);
  }
};

module.exports = {
  signup,
  login,
  logout,
  refresh,
  getCurrentUser,
  updateProfile,
  updatePassword,
};

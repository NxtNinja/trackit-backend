// utils/response.js
const successResponse = (res, data, message = "Success") => {
  return res.json({
    success: true,
    message,
    data,
  });
};

module.exports = { successResponse };

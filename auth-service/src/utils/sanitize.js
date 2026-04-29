// utils/sanitize.js
const sanitizeUser = (user) => ({
  id: user.id,
  name: user.name,
  email: user.email,
});

module.exports = sanitizeUser;

const jwt = require("jsonwebtoken");
const koentji = process.env.JWT_SECRET

const createToken = (payload) => jwt.sign(payload, koentji);
const verifyToken = (token) => jwt.verify(token, koentji);

module.exports = {
  createToken,
  verifyToken,
};

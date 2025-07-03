const jwt = require("jsonwebtoken");
const { jwtSecret } = require("../config/env");

const decodeJwt = (token) => {
  try {
    return jwt.verify(token, jwtSecret);
  } catch (error) {
    throw new Error("Invalid token");
  }
};

module.exports = { decodeJwt };

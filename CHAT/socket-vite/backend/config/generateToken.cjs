/* eslint-disable no-undef */
const jwt = require("jsonwebtoken");

const generateToken = (id) => {
  //generateToken variable takes "id" as parameter and it is the function that is responsibility of generating a token JWT provided by "id" paramenter
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

module.exports = generateToken;

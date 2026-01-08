/* eslint-disable no-undef */
const jwt = require("jsonwebtoken"); // imports the library 'jsonwebtoken' which is use for generating adn verifying JSON web tokens and JWT if used for authentication and authorization purpose.

const User = require("../models/userModel.cjs"); //imports this User from models userModels
const asyncHandler = require("express-async-handler"); //imports async handlers which is used to handle asynchronous routes and it catches error also

const protect = asyncHandler(async (req, res, next) => {
  //imports protect with asyncHandler function used. and this middleware is responsible for protecting routes by validating JWT token.
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    //inside the protect declares if statement and inside of this it checks if the request.headers contain authorization and it starts with string Bearer

    //and If not? it proceeds to middleware without authentication.
    //Authorization occurs to a process which server determinds if the client has permission to be or to use access to a resource file. and that is why JWT is used.
    try {
      //if req.headers.authorization header is present. it extracts this token to be retrieved.
      token = req.headers.authorization.split(" ")[1];
      //it attempts to verify the token using this. jwt.verify and the token has it's resource and process.env.jwt_secret represent if the verification is ready or success it would be the token is valid.
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select("-password"); //this req.user property is used to store the corresponding users from the database using this "findById" and decode the id. this await if used for awaiting for a user to be find in database by requesting the user.

      //and if the token is valid and successfull to retrieve resources and it proceds to next.
      next();
    } catch (error) {
      res.status(401).json({ message: "Invalid token" });
    }
  }
  if (!token) {
    //and if the token is not authorized is will return to a status error and not authorized and no token
    res.status(401);
    throw new Error("Not authorized, no token");
  }
});
module.exports = { protect };

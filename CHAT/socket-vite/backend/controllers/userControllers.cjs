/* eslint-disable no-undef */
const asyncHandler = require("express-async-handler"); //this imports a libary of express for asynchHandler to handle routes and automatically catches error from it.
const User = require("../models/userModel.cjs"); //this imports a User from a userModels
const generateToken = require("../config/generateToken.cjs"); //this imports token

const registerUser = asyncHandler(async (req, res) => {
  //this indicates to register a user with asynchronous routes handler to create a user with extract name, email, password etc,
  const { name, email, password, pic } = req.body;

  if (!name || !email || !password) {
    //if this field name email password is missing in field it throw some error
    res.status(400);
    throw new Error("Please Enter all the Fields");
  }
  const userExists = await User.findOne({ email }); //this field uses findOne for email if the user given some email correctly and if it is already exists so it finds one of an email are equal then return user already exists

  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }
  const user = await User.create({
    //this field indicates if user doesn't exists it will create one another by using User.create with an name,email and another.
    name,
    email,
    password,
    pic,
  });
  if (user) {
    //here it will send the responds created by the user and responses status 201 created and returns a newly created information including this _id of a user below with a name email and another.
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      pic: user.pic,
      token: generateToken(user._id), //with a use of generateToken it will generate the information into JWT using generateToken
    });
  } else {
    res.status(400);
    throw new Error("Failed to create");
  }
});

const authUser = asyncHandler(async (req, res) => {
  //this is an asyncronous handler that handles authenticating email and password field that it was extracted.
  const { email, password } = req.body;
  const user = await User.findOne({ email }); //this field is to find an email that is exist already

  if (user && (await user.matchPassword(password))) {
    //and if the email that was existed already matches the password, if both conditions are true, it send a response of the user information and JWT token.
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      pic: user.pic,
      token: generateToken(user._id),
    });
  } else {
    //and if user doest exist it will send status 401 contains invalid email or password
    res.status(401);
    throw new Error("Invalid Email or Password");
  }
});
const allUsers = asyncHandler(async (req, res) => {
  //this field asyncronous route handler function retrieves all the data of a all users of searches for users from a keyword. it extracts the search query from the request URL.
  const keyword = req.query.search
    ? {
        //if keyword searched.
        $or: [
          { name: { $regex: req.query.search, $options: "i" } }, //it creates expression query to match the name or email using $regex
          { email: { $regex: req.query.search, $options: "i" } },

          //example from the search bar if we search name or email it will shown the exact same data.
        ],
      }
    : {}; //or else it would return empty from a searches if keyword doesnt find matches data

  const users = await User.find(keyword) //to find users matches data from User in a keyword
    .find({ _id: { $ne: req.user._id } });
  res.send(users); //this "users" callback sends the response of retrieved data
});
module.exports = { registerUser, authUser, allUsers };

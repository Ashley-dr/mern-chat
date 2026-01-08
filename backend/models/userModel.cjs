/* eslint-disable no-undef */
//mongoose library allowing to interact with MongoDB nga database.
const mongoose = require("mongoose");

//bcrypt is a library used for hashing data example of password.
const bcrypt = require("bcryptjs");

//this create mongoose schema called userSchema that defines structure of a user document. nag specify og name to be string type and email to string type and password. this required turns to true.
const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
  },
  { timeStamps: true } // enables automatic timestamps of the createdAt and updatedAt, only makita sa backend side at postman if when na create ang user
);

//it matches password even with hashed of a user compares and entered password with hashed password nga nag use og bcrypt compare.
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

//it is a hook from mongoose to save data before saving a document into schema
userSchema.pre("save", async function (next) {
  //checks it the document being saved or if not it will call next(),
  if (!this.isModified) {
    next();
  }

  //declare const sale and generating bcrypt genSalt function. gigamit sya para mo generate of random value kay naka hashed ang password
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model("User", userSchema);
module.exports = User;

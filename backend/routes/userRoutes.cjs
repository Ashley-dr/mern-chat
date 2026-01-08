/* eslint-disable no-undef */
const express = require("express");
const {
  registerUser,
  authUser,
  allUsers,
} = require("../controllers/userControllers.cjs");
const { protect } = require("../middleware/authMiddleware.cjs");
const router = express.Router();
router.route("/").post(registerUser).get(protect, allUsers);
router.post("/login", authUser);
module.exports = router;

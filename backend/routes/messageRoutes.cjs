/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
const express = require("express");
const { protect } = require("../middleware/authMiddleware.cjs");
const upload = require("../middleware/fileUpload.cjs");
const {
  sendMessage,
  allMessages,
} = require("../controllers/messageControllers.cjs");

const router = express.Router();

router.route("/").post(protect, upload.single("file"), sendMessage);
router.route("/:chatId").get(protect, allMessages);

module.exports = router;

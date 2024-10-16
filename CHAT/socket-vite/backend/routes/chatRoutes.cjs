/* eslint-disable no-undef */
const express = require("express");
const { protect } = require("../middleware/authMiddleware.cjs");
const {
  accessChat,
  fetchChats,
  createGroupChat,
  renameGroup,
  addToGroup,
  removeFromGroup,
} = require("../controllers/chatControllers.cjs");
//in some frameworks or library as we all know are dynamically single page and to route another data we access through routers so we can go with another links indicated
//router define routes and associate them with HTTP
const router = express.Router();
//protect are applied for all routes
router.route("/").post(protect, accessChat); //this post for accessing a chat and used post
router.route("/").get(protect, fetchChats); //this get is to fetch chat
router.route("/group").post(protect, createGroupChat); //this post  route is for creating a group chat
router.route("/rename").put(protect, renameGroup); //tgis put route is for renaming a group so we use put
router.route("/groupremove").put(protect, removeFromGroup); //this put route is for removing a user from group
router.route("/groupadd").put(protect, addToGroup); //this put route is to add a users to a group

module.exports = router;

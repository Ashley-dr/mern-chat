/* eslint-disable no-undef */
// middleware/fileUpload.js
const cloudinary = require("../config/cloudinaryConfig.cjs");
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "chat_images", // Folder name in Cloudinary
    allowed_formats: ["jpg", "png", "jpeg", "gif"], // Allowed formats
  },
});

const upload = multer({ storage: storage });

module.exports = upload;

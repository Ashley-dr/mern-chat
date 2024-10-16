/* eslint-disable no-undef */
const mongoose = require("mongoose");

const messageModel = mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId, //it is a field for a sender and uses moongose schema of an object type to store by it's ID of a user and it refers to a "User" users only.
      ref: "User",
    },
    content: {
      //this field that represents content of a message, what ever you see in chats indicates this content for a user for chat, the type with string.
      type: String,
      trim: true,
    },
    chat: {
      //this field indicates the chats of a messages where it belong and it uses mongoose schema type to store a message reference of a "Chat"
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chat",
    },
    file: {
      type: String, // This will store the file path or URL
    },
  },
  {
    timeStamps: true,
  }
);
const Message = mongoose.model("Message", messageModel);
module.exports = Message;

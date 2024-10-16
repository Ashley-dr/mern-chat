/* eslint-disable no-undef */
const mongoose = require("mongoose");

const chatModel = mongoose.Schema(
  {
    chatName: { type: String, trim: true }, //it has type String value and it represents the name of a chat that uses string, and the trim option removes leading whitespaces.
    isGroupChat: { type: Boolean, Default: false }, //it represents if a groupChat boolean true or false and it declares false
    users: [
      //in users: it is a array field  represents the users to be in chat.
      {
        type: mongoose.Schema.Types.ObjectId, //this type is to store references to ref: User object model
        ref: "User",
      },
    ],
    latestMessage: {
      type: mongoose.Schema.Types.ObjectId, //it is a field of a latest message of a user in chat it also uses type this mongoose schema and references of a model with a ref Message for a message or latest message.
      ref: "Message",
    },
    groupAdmin: {
      type: mongoose.Schema.Types.ObjectId, // this field are for a user if it is a group admin and it refers to a "User" model to for users only
      ref: "User",
    },
  },
  {
    timeStamps: true, //in mongoose schema uses timestamps to true if user succesfully created and it returns when it is created.
  }
);
const Chat = mongoose.model("Chat", chatModel);
module.exports = Chat;

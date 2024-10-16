/* eslint-disable no-undef */
const AsyncHandler = require("express-async-handler");
const Message = require("../models/messageModel.cjs");
const User = require("../models/userModel.cjs");
const Chat = require("../models/chatModels.cjs");

//req (request). res(response)
// const sendMessage = AsyncHandler(async (req, res) => {
//   //this field sendMessage asyncronous route handler that handles sending a message it extracts contenct and chatId fields from requested body.
//   const { content, chatId } = req.body;
//   if (!content || !chatId) {
//     //checks if content and chatId fields are empty it sends status 400
//     console.log("Invalid Data passed to request");
//     return res.sendStatus(400);
//   }
//   var newMessage = {
//     //this newMessage constructs object sender to req.user._id
//     sender: req.user._id,
//     content: content, //content is set to provided content, as we can see at chats we have content represents the message content string.
//     chat: chatId, //chat is set to provided chatId, as we can see at message we include chatid as important response for out data.
//   };
//   try {
//     var message = await Message.create(newMessage); //inside try block we have message as to create a new message if content and chatId is passed clearly from requested body.

//     //the populate method is used to populate sender field with the user 'name' in 'message' also populates chat.
//     //when defining schema in mongoose it sets up relationships between these models using ref, and it would be not so inconvenient to retrieve document from database.
//     //and it's example in this chat app we might have a message model and sender field referencing User model.
//     message = await message.populate("sender", "name"); //populates this field of each message corresponding the name of a user.
//     message = await message.populate("chat"); //populate the chat field of each messages.
//     message = await User.populate(message, {
//       path: "chat.users",
//       select: "name email",
//     });
//     await Chat.findByIdAndUpdate(req.body.chatId, {
//       latestMessage: message,
//     });
//     res.json(message);
//   } catch (error) {
//     res.status(400);
//     throw new Error(error.message);
//   }
// });
const sendMessage = AsyncHandler(async (req, res) => {
  const { content, chatId } = req.body;
  const file = req.file ? req.file.path : null; // Get file URL if uploaded

  if (!content && !file) {
    console.log("Invalid Data passed to request");
    return res.sendStatus(400);
  }

  const newMessage = {
    sender: req.user._id,
    content,
    chat: chatId,
    file, // Include the file URL
  };

  try {
    let message = await Message.create(newMessage);
    message = await message.populate("sender", "name");
    message = await message.populate("chat");
    message = await User.populate(message, {
      path: "chat.users",
      select: "name email",
    });
    await Chat.findByIdAndUpdate(chatId, { latestMessage: message });
    res.json(message);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});
const allMessages = AsyncHandler(async (req, res) => {
  //this is a variable with named allMessage holds asyncHandler function that handles asynchronous operations within express route. it helps simplify error and catching error and to pass into next function from express
  try {
    //within try block
    const messages = await Message.find({ chat: req.params.chatId }) //it containcs variable message and uses await from axios to wait a response and Message.find is a method called to query the database and within this it finds all messages associated the specified chat ID of request parameter chatId
      .populate("sender", "name email") //this populate is used to populate sender and chat field of each messages with corresponding documents from the User above and from the Chat models. it allows to retrieve data from sender and the chat
      .populate("chat");
    res.json(messages); //the resulting this "message" is assigned to retrieve messages from populated fields
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});
module.exports = { sendMessage, allMessages };

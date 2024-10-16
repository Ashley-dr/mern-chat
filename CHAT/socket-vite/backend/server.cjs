/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { chats } = require("./data/data.cjs");
const connectDB = require("./config/db.cjs");
const userRoutes = require("./routes/userRoutes.cjs");
const chatRoutes = require("./routes/chatRoutes.cjs");
const messageRoutes = require("./routes/messageRoutes.cjs");
const { Server } = require("socket.io");
dotenv.config();
connectDB();
const app = express();
app.use(cors());
app.use(express.json());

//route with callback and takes request and response
app.get("/", (req, res) => {
  res.send("API is Running!");
});

app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);

const PORT = process.env.PORT || 5000;

const path = require("path");

app.use("/uploads", express.static(path.join(__dirname, "uploads")));
//start here for socket.io
const server = app.listen(PORT, () => {
  console.log(`Server Started on PORT ${PORT}`);
});

const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin: "http://localhost:5173", //with a use of cors, pwedi maka use og proxy this this localhost connection from the origin
  },
});

//io.on uses for listening for the connection between user to user and the "connection" is and event, and the callback function (socket) recieves it
io.on("connection", (socket) => {
  console.log("connected to socket.io");

  //socket.on listening for the "setup" and it's callback function is userData it uses to receive data object send by client, if user is connected it will return the emit to "connected" event back to client
  socket.on("setup", (userData) => {
    socket.join(userData._id);
    console.log(userData._id);
    socket.emit("connected");
  });
  //same as it shows above. the "setup" listener recieves data to callback function "room". if socket detects a user joining a room or a user to user has connected to it's user it will return the data to funtion room.
  socket.on("setup", (room) => {
    socket.join(room);
    console.log("User Joined Room: " + room);
  });

  //same as it shows above. the corresponding data of event listener "new message" has it's callback funtion "newMessageRecieved" which is emmiting client when this user new message is sent.
  socket.on("new message", (newMessageRecieved) => {
    var chat = newMessageRecieved.chat;
    //if it is not a user it will return chat user is not defined or else.
    if (!chat || !chat.users) {
      console.log("Chat or Chat.users not defined");
      return;
    }
    //chat.users foreach by each user it iterates users in chat. each sender emits "message recieved" event listener to corresponding user's socket and sending each other's "newMessageRecieved"
    chat.users.forEach((user) => {
      if (user._id == newMessageRecieved.sender._id) return;
      socket.in(user._id).emit("message recieved", newMessageRecieved);
    });
  });
});

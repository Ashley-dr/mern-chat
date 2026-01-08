/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { React, useEffect, useState } from "react";
import { ChatState } from "../Context/ChatProvider";
import {
  Box,
  Button,
  FormControl,
  Input,
  Spinner,
  Text,
  useToast,
} from "@chakra-ui/react";
import { AiOutlineArrowLeft } from "react-icons/ai";
import { getSender, getSenderFull } from "../config/ChatLogics";
import ProfileModal from "./miscellaneous/ProfileModal";
import UpdateGroupChatModal from "./miscellaneous/UpdateGroupChatModal";
import axios from "axios";
import ScrollableChat from "./ScrollableChat";
import io from "socket.io-client";
import InputEmoji from "react-input-emoji";

const ENDPOINT = "http://localhost:5000";
var socket, selectedChatCompare;

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const { user, selectedChat, setSelectedChat } = ChatState();

  const [socketConnected, setSocketConnected] = useState(false);
  const toast = useToast();
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };
  const fetchMessages = async () => {
    //sa kani nga component naga require og async function nga mo retrieve of messages for the selected chat by a user to user and making HTTP get request to get server and it updates the "messages" state. and as we can see below naay emit from socket event to join chat the room because even single chat and group chat sa page is same ge join ra sila og room ang duha ka user to connect with each other

    if (!selectedChat) {
      return;
    }
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      setLoading(true);
      console.log(messages);
      //also in order to fetch message we have to make a HTTP get method to recieve a data from a user
      const { data } = await axios.get(
        `http://localhost:5000/api/message/${selectedChat._id}`,
        config
      );
      setMessages(data);
      setLoading(false);
      socket.emit("join chat", selectedChat._id);
    } catch (error) {
      toast({
        title: "Error!",
        description: "Failed to Load a message.",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
    }
  };

  useEffect(() => {
    //this is the first useEffect and importante nga e set above first this useEffect because it contains the endpoint of a socket io and to connect it to the server of socket io
    socket = io(ENDPOINT);
    socket.emit("setup", user);
    socket.on("connection", () => setSocketConnected(true));
  }, []);

  const sendFile = async () => {
    const formData = new FormData();
    formData.append("content", newMessage); // Include the message content
    formData.append("chatId", selectedChat._id);
    if (file) {
      formData.append("file", file); // Append the file to FormData
    }

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
          "Content-Type": "multipart/form-data", // For file uploads
        },
      };

      const { data } = await axios.post(
        "http://localhost:5000/api/message/",
        formData,
        config
      );

      socket.emit("new message", data);
      setMessages([...messages, data]); // Add the new message to the state
      setNewMessage(""); // Clear the message input
      setFile(null); // Clear the file input
    } catch (error) {
      toast({
        title: "Error!",
        description: "Failed to send a message.",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
    }
  };

  const sendMessage = async () => {
    if (newMessage) {
      try {
        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };
        setNewMessage(""); // Clear the message after sending
        const { data } = await axios.post(
          "http://localhost:5000/api/message",
          {
            content: newMessage,
            chatId: selectedChat._id,
          },
          config
        );
        socket.emit("new message", data);
        setMessages([...messages, data]);
      } catch (error) {
        toast({
          title: "Error!",
          description: "Failed to send a message.",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "top",
        });
      }
    }
  };

  useEffect(() => {
    //this is the second use Effect. this useEffect is used for fetching a message and if the selected chat user is changes it fetch a data of selected chat whenever there are changes happening.
    fetchMessages();
    selectedChatCompare = selectedChat;
  }, [selectedChat]);

  useEffect(() => {
    //this is the third or last useEffect hook to listen socket events and updates messages dynamicaly when a new message is recieved
    socket.on("message recieved", (newMessageRecieved) => {
      if (
        !selectedChatCompare ||
        selectedChatCompare._id !== newMessageRecieved.chat._id
      ) {
        /* empty */
      } else {
        setMessages([...messages, newMessageRecieved]);
      }
    });
  });

  const typingHandler = (e) => {
    setNewMessage(e.target.value);
  };

  return (
    <>
      {selectedChat ? ( //if selectedChat is exist or og naay ge select nga user from a chat page it will render the chat interface
        <>
          <Text
            fontSize={{ base: "28px", md: "30px" }}
            pb={3}
            px={2}
            w="100%"
            fontFamily="monospace"
            display="flex"
            justifyItems="center"
            justifyContent={{ base: "space-between" }}
          >
            <AiOutlineArrowLeft
              cursor="pointer"
              display={{ base: "flex", md: "none" }}
              onClick={() => setSelectedChat("")}
            />
            {!selectedChat.isGroupChat ? (
              <>
                {getSender(user, selectedChat.users)}
                <ProfileModal user={getSenderFull(user, selectedChat.users)} />
              </>
            ) : (
              <>
                {selectedChat.chatName.toUpperCase()}
                <UpdateGroupChatModal
                  fetchAgain={fetchAgain}
                  setFetchAgain={setFetchAgain}
                  fetchMessages={fetchMessages}
                />
              </>
            )}
          </Text>
          <Box
            display="flex"
            flexDir="column"
            justifyContent="flex-end"
            p={3}
            bg="#e8e8e833"
            w="100%"
            h="100%"
            overflowY="hidden"
            borderRadius="lg"
          >
            {loading ? (
              <Spinner
                size="md"
                w={20}
                h={20}
                alignSelf="center"
                margin="auto"
              />
            ) : (
              <Box
                display="flex"
                flexDirection="column"
                overflowY="scroll"
                style={{ scrollbarWidth: "none" }}
              >
                <ScrollableChat messages={messages} />
              </Box>
            )}

            <FormControl isRequired mt={3}>
              <InputEmoji
                value={newMessage}
                onChange={setNewMessage} // Automatically updates state when the user types or selects an emoji
                cleanOnEnter // Clears the input after pressing Enter
                onEnter={sendMessage} // Calls the sendMessage function when Enter is pressed
                placeholder="Enter message"
              />
              <Box display="flex" mt={2}>
                <Input
                  type="file"
                  mx={5}
                  w={64}
                  px={2}
                  pt={1}
                  accept=".jpeg,.jpg,.png,.gif,.pdf,.doc,.docx"
                  onChange={handleFileChange}
                />
                <Button onClick={sendFile}>Send</Button>
              </Box>
            </FormControl>
          </Box>
        </>
      ) : (
        //else if we dont select a user it wont render a user or it will display Start a conversation
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          h="100%"
        >
          <Text fontSize="3xl" pb={3} fontFamily="monospace">
            Start a Conversation.
          </Text>
        </Box>
      )}
    </>
  );
};

export default SingleChat;

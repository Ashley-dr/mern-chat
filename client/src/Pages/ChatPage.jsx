/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Center, Container, Box, Text, AbsoluteCenter } from "@chakra-ui/react";
import { ChatState } from "../Context/ChatProvider";
import SideDrawer from "../components/miscellaneous/SideDrawer";
import MyChats from "../components/MyChats";
import ChatBox from "../components/ChatBox";

const ChatPage = () => {
  //inside chatpage component function useState and ChatState hooks deployed
  const { user } = ChatState(); //inside of this ChatState it provides props from a chat provider context and context values are obtained by chat provider
  const [fetchAgain, setFetchAgain] = useState(false);
  return (
    <Container maxW="100%">
      {" "}
      {/**over all inside this container it represents chat page that includes side drawer with a list of a users of chats component myChats and a chatbox component */}
      {user && <SideDrawer />}{" "}
      {/** inside this container if user exist it rendered the SideDrawer component as we can see in our web site left side drawer */}
      <Box
        display="flex"
        justifyContent="space-between"
        w="100%"
        h="91vh"
        p="10px"
      >
        {user && <MyChats fetchAgain={fetchAgain} />}{" "}
        {/** inside side drawer if user exist wihin box the MyChats component rendered and passing the props or getting information by props using "fetchAgain" */}
        {user && (
          <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
        )}{" "}
        {/** inside side drawer we have chatbox component if user exist and it will render the component by fetchagain propst and passing the value at setFetchAgain props */}
      </Box>
    </Container>
  );
};

export default ChatPage;

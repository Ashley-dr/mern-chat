/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React from "react";
import ScrollableFeed from "react-scrollable-feed";
import {
  isLastMessage,
  isSameSender,
  isSameSenderMargin,
  isSameUser,
} from "../config/ChatLogics";
import { ChatState } from "../Context/ChatProvider";
import { Avatar, Box, Text } from "@chakra-ui/react";
const ScrollableChat = ({ messages }) => {
  const { user } = ChatState();

  return (
    <ScrollableFeed>
      {messages &&
        messages.map((m, i) => (
          <div style={{ display: "flex" }} key={m._id}>
            {(isSameSender(messages, m, i, user._id) ||
              isLastMessage(messages, i, user._id)) && (
              <Avatar
                name={m.sender.name}
                src={m.sender.name}
                h={9}
                w={9}
                mr={3}
                mt={3}
                border="solid 1px teal"
              />
            )}
            <span
              style={{
                backgroundColor: `${
                  m.sender._id === user._id ? "#00B5D8" : "#9F7AEA"
                }`,
                borderRadius: "8px",
                padding: "5px 10px",
                maxWidth: "75%",
                fontFamily: "sans-serif",
                size: "10px",
                marginLeft: isSameSenderMargin(messages, m, i, user._id),
                marginTop: isSameUser(messages, m, i, user._id) ? 3 : 10,
              }}
            >
              {m.content}
              <img src={m.file} />
            </span>
          </div>
        ))}
    </ScrollableFeed>
  );
};

export default ScrollableChat;

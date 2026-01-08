/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { Box } from "@chakra-ui/react";
import React from "react";
import { RiCloseFill } from "react-icons/Ri";
const UserBadgeItem = ({ user, handleFunction }) => {
  return (
    <Box
      px={2}
      py={1}
      borderRadius="lg"
      m={1}
      mb={2}
      fontSize={12}
      bg="teal"
      cursor="pointer"
      onClick={handleFunction}
      display="flex"
    >
      {user.name}
      <RiCloseFill ml={4} pl={1} />
    </Box>
  );
};

export default UserBadgeItem;

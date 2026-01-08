/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from "react";
import { Avatar, IconButton, useDisclosure } from "@chakra-ui/react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
} from "@chakra-ui/react";
import { GiConvergenceTarget } from "react-icons/gi";

const ProfileModal = ({ user, children }) => {
  //this modal for profile component accepts two props user and children
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      {/** This is a modal for single chat */}
      {children ? ( //checks if the children props provides when using this profilemodal. and it renders a span element and children of a user, as we can see in profile modal we can see the username and email in single chat of another user.
        <span onClick={onOpen}>{children}</span>
      ) : (
        <IconButton
          display={{ base: "flex" }}
          icon={<GiConvergenceTarget />}
          onClick={onOpen}
        />
      )}

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent background="teal.900">
          <ModalHeader textAlign="center">{user.name}</ModalHeader>
          <ModalCloseButton />
          <ModalBody textAlign="center" fontFamily="monospace">
            {/** I am gonna put Bio inside here soon */}
            <Avatar size="sm" name={user.name} mr="5"></Avatar>
            <span>Email: </span>
            {user.email}
          </ModalBody>

          <ModalFooter></ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ProfileModal;

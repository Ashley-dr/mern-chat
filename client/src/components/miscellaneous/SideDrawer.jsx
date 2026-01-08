/* eslint-disable no-unused-vars */
import { React, useState } from "react";
import {
  Center,
  Container,
  Box,
  Text,
  Tooltip,
  Button,
  Menu,
  MenuButton,
  MenuList,
  Avatar,
  MenuItem,
  Toast,
  useToast,
  Spinner,
} from "@chakra-ui/react";
import { CiSearch } from "react-icons/Ci";
import { BsMenuButtonWideFill, BsBellFill } from "react-icons/Bs";
import { ChatState } from "../../Context/ChatProvider.jsx";
import Profilemodal from "./ProfileModal.jsx";
import { useNavigate } from "react-router-dom";
import { useDisclosure } from "@chakra-ui/hooks";
import {
  Input,
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
} from "@chakra-ui/react";
import ChatLoading from "../ChatLoading.jsx";
import axios from "axios";
import UserListItem from "../UserAvater/UserListItem.jsx";

const SideDrawer = () => {
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState();
  const { user, email, selectedChat, setSelectedChat, chats, setChats } =
    ChatState();
  const history = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const handleSearch = async () => {
    if (!search) {
      toast({
        title: "Empty input search, Please Enter.",
        status: "warning",
        duration: 500,
        isClosable: true,
        position: "top-left",
      });
    }
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(
        `http://localhost:5000/api/user?search=${search}`,
        config
      );
      setLoading(false);
      setSearchResult(data);
    } catch (error) {
      toast({
        title: "Error!.",
        description: "Failed to Load the Search Results",
        status: "error",
        duration: 500,
        isClosable: true,
        position: "top-left",
      });
    }
  };

  const accessChat = async (userId) => {
    try {
      setLoadingChat(true);
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.post(
        "http://localhost:5000/api/chat",
        { userId },
        config
      );

      if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);
      setSelectedChat(data);
      setLoading(false);
      onClose();
    } catch (error) {
      toast({
        title: "Error!.",
        description: "Error",
        status: "error",
        duration: 500,
        isClosable: true,
        position: "top-left",
      });
    }
  };

  const logOutHandler = () => {
    localStorage.removeItem("userInfo");
    history("/");
  };

  return (
    <div>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        w="100%"
        p="5px 10px 5px 10px"
        borderWidth="2px"
        borderRadius="5px"
        bg="white"
        mt="5"
        borderColor="teal.700"
        background="teal.800"
      >
        <Tooltip label="Search Users" hasArrow placement="bottom-end">
          <Button onClick={onOpen}>
            <CiSearch />
            <Text d={{ base: "none", md: "flex" }} px="4">
              Find Users
            </Text>
          </Button>
        </Tooltip>
        <Text m="auto" fontFamily="mono" pr="1" color="white">
          MERN Chat
        </Text>
        <Menu>
          <MenuButton pr="10">{/**<MenuList></MenuList> */}</MenuButton>
        </Menu>
        <Menu>
          <Tooltip label="Profile" hasArrow placement="bottom">
            <MenuButton as={Button} rightIcon={<BsMenuButtonWideFill />} pl="2">
              <Avatar size="sm" cursor="pointer" name={user.name}></Avatar>
            </MenuButton>
          </Tooltip>
          <MenuList>
            <Profilemodal user={user} email={email}>
              <MenuItem>Profile</MenuItem>
            </Profilemodal>
            <MenuItem onClick={logOutHandler}>Logout</MenuItem>
          </MenuList>
        </Menu>
      </Box>

      <Drawer placement={"left"} onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Find users.</DrawerHeader>

          <DrawerBody>
            <Box display="flex" pb={2}>
              <Input
                placeholder="Find users by name or email."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Button onClick={handleSearch}>🔍</Button>
            </Box>
            {loading ? (
              <ChatLoading />
            ) : (
              searchResult?.map((user, email) => (
                <UserListItem
                  key={user._id}
                  user={user}
                  email={email}
                  handleFunction={() => accessChat(user._id)}
                />
              ))
            )}
            {loadingChat && <Spinner ml="auto" display="flex" />}
          </DrawerBody>

          <DrawerFooter></DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>
  );
};

export default SideDrawer;

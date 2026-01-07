/* eslint-disable no-unused-vars */
import {
  FormControl,
  FormLabel,
  VStack,
  Input,
  InputGroup,
  InputRightElement,
  ButtonGroup,
} from "@chakra-ui/react";
import { Button } from "@chakra-ui/react";
import React, { useState } from "react";
import { useToast } from "@chakra-ui/react";
import axios from "axios";
import { useHistory } from "react-router-dom";
import { AiOutlineEye } from "react-icons/Ai";

const Signup = () => {
  const [show, setShow] = useState(false);
  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [confirmpassword, setConfirmpassword] = useState();
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const handleClick = () => setShow(!show);
  const history = useHistory();

  const submitHandler = async () => {
    setLoading(true);
    if (!name || !email || !password || !confirmpassword) {
      toast({
        title: "Fill all the Fields",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      setLoading(false);
      return;
    }
    if (password !== confirmpassword) {
      toast({
        title: "Password Does not Match",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
    }
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };
      //if input register is valid or register success it routes to HTTP post into api user and accomodate the name email and password from registration
      const { data } = await axios.post(
        "http://localhost:5000/api/user",
        { name, email, password },
        config
      );
      toast({
        title: "Registration Complete.",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      localStorage.setItem("userInfo", JSON.stringify(data)); //if request is valid it sets the data and recieving it to "data" on what user information entry and the user information will store in a localstorage
      setLoading(false);
      history.push("/chats");
    } catch (error) {
      toast({
        title: "Registration failed",
        description:
          error.response && error.response.data.message
            ? error.response.data.message
            : "Account Already Exists",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      setLoading(false);
    }
  };

  return (
    <VStack spacing="5px" color="black">
      {/* For Full name */}
      <FormControl id="fist-name" isRequired>
        <FormLabel>Fullname</FormLabel>
        <Input
          border={"1px"}
          borderStyle={"solid"}
          placeholder="Input Fullname"
          onChange={(e) => setName(e.target.value)}
        />
      </FormControl>

      {/* For email */}
      <FormControl id="email" isRequired>
        <FormLabel>Email</FormLabel>
        <Input
          border={"1px"}
          borderStyle={"solid"}
          placeholder="Input Email"
          onChange={(e) => setEmail(e.target.value)}
        />
      </FormControl>

      {/* For password */}
      <FormControl id="pasword" isRequired>
        <FormLabel>Password</FormLabel>
        <InputGroup>
          <Input
            border={"1px"}
            borderStyle={"solid"}
            type={show ? "text" : "password"}
            placeholder="Input Password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <InputRightElement>
            <AiOutlineEye size="25px" onClick={handleClick}>
              {show ? "Hide" : "Show"}
            </AiOutlineEye>
          </InputRightElement>
        </InputGroup>
      </FormControl>

      {/* For confirm password */}
      <FormControl id="password" isRequired>
        <FormLabel>Confirm Password</FormLabel>
        <InputGroup>
          <Input
            border={"1px"}
            borderStyle={"solid"}
            type={show ? "text" : "password"}
            placeholder="Confirm Password"
            onChange={(e) => setConfirmpassword(e.target.value)}
          />
          <InputRightElement>
            <AiOutlineEye size="25px" onClick={handleClick}>
              {show ? "Hide" : "Show"}
            </AiOutlineEye>
          </InputRightElement>
        </InputGroup>
      </FormControl>

      <Button
        bg={"gray.900"}
        colorScheme="orange"
        mt={5}
        color={"white"}
        width="100%"
        fontSize={"xs"}
        isLoading={loading}
        onClick={submitHandler}
      >
        Sign up
      </Button>
    </VStack>
  );
};

export default Signup;

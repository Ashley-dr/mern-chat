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

const Login = () => {
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const toast = useToast();
  const history = useHistory();

  const handleClick = () => setShow(!show);

  const submitHandler = async () => {
    //sets to sync funtion to handle form submission
    setLoading(true);
    if (!email || !password) {
      //if email and password is empty in a field it shows warning
      toast({
        title: "Fill all the Fields",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
      return;
    }
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };
      //if inside input is valid, bellow HTTP post request is made to the server using axios.post and the request is send to api user login route if email and password is valid
      const { data } = await axios.post(
        "http://localhost:5000/api/user/login",
        { email, password },
        config
      );
      toast({
        title: "Login Successfull.",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      localStorage.setItem("userInfo", JSON.stringify(data)); //if the request if valid or available the "data" is set to receive data and user information is stored into localstorage using localStorage.setItem.
      setLoading(false); //otherwise after succession the loading is set to false as it's done
      history.push("/chats"); //and data pushes redirecting to /chats route
    } catch (error) {
      toast({
        title: "Error!.",
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
      {/* For email */}
      <FormControl id="email" isRequired>
        <FormLabel>Email</FormLabel>
        <Input
          placeholder="Input Email"
          border={"1px"}
          borderStyle={"solid"}
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
        Log in
      </Button>
    </VStack>
  );
};

export default Login;

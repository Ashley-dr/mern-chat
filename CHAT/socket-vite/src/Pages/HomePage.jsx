/* eslint-disable no-unused-vars */
import { React, useEffect } from "react";
import { Center, Container, Box, Text, AbsoluteCenter } from "@chakra-ui/react";
import { Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react";
import Login from "../components/Authentication/Login";
import SignUp from "../components/Authentication/Signup";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
const HomePage = () => {
  const history = useHistory();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("userInfo"));
    if (user) history.push("/chats");
  }, [history]);

  return (
    <Container maxW="xl" centerContent>
      <Box display="flex" justifyContent="center" justifyItems="center" p={16}>
        {" "}
      </Box>

      <Box bg="white" w="110%" p="20px" borderRadius="base" borderWidth="2px">
        <Tabs isFitted color={"black"}>
          <TabList mb="1em">
            <Tab style={{ borderRadius: "3px" }}>Log-In</Tab>
            <Tab style={{ borderRadius: "3px" }}>Register</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Login />
            </TabPanel>
            <TabPanel>
              <SignUp />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Container>
  );
};

export default HomePage;

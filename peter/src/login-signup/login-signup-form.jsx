import React, { useState } from "react";
import {
  Box,
  FormControl,
  FormLabel,
  Input,
  Button,
  VStack,
  Image,
  Text,
} from "@chakra-ui/react";

import logo from "../assets/kcharles.svg";

const LoginSignUp = ({ setIsAuth }) => {
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [registrationData, setRegistrationData] = useState({
    email: "",
    password: "",
  });

  const handleLogin = () => {
    setIsAuth(true);
  };

  const handleRegistration = () => {
    console.log("Registration data:", registrationData);
  };

  return (
    <>
      <Image src={logo} mx="auto" my={"50px"} />
      <Box mx="auto" mt={{ base: "5%", md: "15%", xl: "10%", "2xl": "8%" }}>
        <VStack
          spacing={4}
          w={{ base: "300px", md: "400px" }}
          mx="auto"
          boxShadow={"md"}
          borderRadius={"6px"}
          px={4}
          py={6}
          textAlign={"center"}
        >
          <Text>Login to KCharles Load Board to see your dashboard</Text>
          <Box w="100%">
            <FormControl id="login-email">
              <FormLabel>Email address</FormLabel>
              <Input
                type="email"
                value={loginData.email}
                onChange={(e) =>
                  setLoginData({ ...loginData, email: e.target.value })
                }
              />
            </FormControl>
          </Box>

          <Box w="100%">
            <FormControl id="login-password">
              <FormLabel>Password</FormLabel>
              <Input
                type="password"
                value={loginData.password}
                onChange={(e) =>
                  setLoginData({ ...loginData, password: e.target.value })
                }
              />
            </FormControl>
          </Box>

          <Button colorScheme="blue" onClick={handleLogin} w="100%" mt={4}>
            Login
          </Button>

          {/* Forgot Password */}
          <Text fontSize="sm" color="blue.500" cursor="pointer">
            Forgot your password?
          </Text>

          {/* Sign Up Button */}
          <Button colorScheme="green" onClick={handleRegistration}>
            Sign Up
          </Button>

          {/* <Box>
          <FormControl id="registration-email">
            <FormLabel>Registration Email address</FormLabel>
            <Input
              type="email"
              value={registrationData.email}
              onChange={(e) =>
                setRegistrationData({
                  ...registrationData,
                  email: e.target.value,
                })
              }
            />
          </FormControl>
        </Box>

        <Box>
          <FormControl id="registration-password">
            <FormLabel>Registration Password</FormLabel>
            <Input
              type="password"
              value={registrationData.password}
              onChange={(e) =>
                setRegistrationData({
                  ...registrationData,
                  password: e.target.value,
                })
              }
            />
          </FormControl>
        </Box>

        <Button colorScheme="green" onClick={handleRegistration}>
          Register
        </Button> */}
        </VStack>
      </Box>
    </>
  );
};

export default LoginSignUp;

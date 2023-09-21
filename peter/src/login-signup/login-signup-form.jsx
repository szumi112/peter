import { useState } from "react";
import {
  Box,
  FormControl,
  FormLabel,
  Input,
  Button,
  VStack,
  Image,
  Text,
  useColorMode,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

import { database } from "../firebase-config/firebase-config";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";

import { isValidEmail } from "./modules/email-validation";

import logo from "../assets/kcharles.svg";

const LoginSignUp = () => {
  const navigate = useNavigate();
  const { colorMode } = useColorMode();
  const [showLoginForm, setShowLoginForm] = useState(true);
  const [loginData, setLoginData] = useState({ email: "", password: "" });

  const [loginErrorMessage, setLoginErrorMessage] = useState("");

  const handleLogin = () => {
    if (!isValidEmail(loginData.email)) {
      setLoginErrorMessage("Invalid email format.");
      return;
    }

    signInWithEmailAndPassword(database, loginData.email, loginData.password)
      .then((data) => {
        setLoginErrorMessage("");
        console.log(data, "authData");
        navigate("/dashboard");
      })
      .catch((error) => {
        if (loginData.password.length < 6) {
          setLoginErrorMessage("Password must be at least 6 characters long.");
        } else {
          setLoginErrorMessage("Email or password incorrect.");
        }
        console.error("Login error:", error);
      });
  };

  const handleRegistration = () => {
    if (!isValidEmail(loginData.email)) {
      setLoginErrorMessage("Invalid email format.");
      return;
    }

    createUserWithEmailAndPassword(
      database,
      loginData.email,
      loginData.password
    )
      .then((data) => {
        setLoginErrorMessage("");
        console.log(data, "authData");
        navigate("/dashboard");
      })
      .catch((error) => {
        if (loginData.password.length < 6) {
          setLoginErrorMessage("Password must be at least 6 characters long.");
        } else {
          setLoginErrorMessage(
            "Registration failed. Are you sure you don't have an account yet?"
          );
        }
        console.error("Login error:", error);
      });
  };

  return (
    <>
      <Image src={logo} mx="auto" mt={"25px"} mb={"10px"} />
      <Box
        mx="auto"
        mt={{ base: "5%", md: "5%", xl: "3%", "2xl": "5%" }}
        mb={"40px"}
      >
        <VStack
          spacing={4}
          w={{ base: "300px", md: "400px" }}
          mx="auto"
          boxShadow={colorMode === "dark" ? "0px 1px 2px #065666" : "md"}
          px={4}
          py={6}
          textAlign={"center"}
          backgroundColor={colorMode === "dark" ? "gray.900" : "white"}
        >
          <Text mb={4}>
            {!showLoginForm
              ? "Register to get access to KCharles's Load Board "
              : "Login to KCharles Load Board to see your dashboard"}
          </Text>
          {showLoginForm && (
            <>
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
            </>
          )}
          {!showLoginForm && (
            <>
              <Box w="100%">
                <FormControl id="registration-email">
                  <FormLabel>Registration Email address</FormLabel>
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
                <FormControl id="registration-password">
                  <FormLabel>Registration Password</FormLabel>
                  <Input
                    type="password"
                    value={loginData.password}
                    onChange={(e) =>
                      setLoginData({ ...loginData, password: e.target.value })
                    }
                  />
                </FormControl>
              </Box>

              <Button
                colorScheme="blue"
                onClick={handleRegistration}
                w="100%"
                mt={4}
              >
                Register
              </Button>
            </>
          )}

          <Text fontSize="sm" color="red.500" mt={2}>
            {loginErrorMessage}
          </Text>

          <Text fontSize="sm" color="blue.500" cursor="pointer">
            Forgot your password?
          </Text>

          <Button
            colorScheme="green"
            onClick={() => setShowLoginForm((prev) => !prev)}
          >
            {showLoginForm ? "Sign Up" : "Sign In"}
          </Button>
        </VStack>
      </Box>
    </>
  );
};

export default LoginSignUp;

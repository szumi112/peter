import { Box, Button, Flex, Image, Text, useColorMode } from "@chakra-ui/react";
import { signOut } from "firebase/auth";
import { database } from "../firebase-config/firebase-config";
import { useNavigate } from "react-router-dom";
import { useUser } from "../user-context";
import { useMatch } from "react-router-dom";
import logo from "../assets/kcharles.svg";
import white_phone from "../assets/phone_icon_white.png";
import phone from "../assets/phone_icon.png";
import white_email from "../assets/email_icon_white.png";
import email from "../assets/email_icon.png";
import ColorModeSwitch from "../color-mode/color-mode-switch";

const Navigation = () => {
  const { colorMode } = useColorMode();
  const { userInfo } = useUser();
  const navigate = useNavigate();
  const handleClick = () => {
    signOut(database).then(navigate("/"));
  };
  const isAdminRoute = useMatch("/admin");

  return (
    <Box
      mb={8}
      borderBottom={"1px solid"}
      borderBottomColor={colorMode == "dark" ? "gray.700" : "gray.100"}
      pb={4}
    >
      <Flex justifyContent={"space-between"} alignItems={"center"}>
        <Image src={logo} mt={"25px"} mb={"10px"} />
        <Flex alignItems={"center"}>
          <Image
            src={colorMode == "dark" ? white_email : email}
            w="20px"
            h="18px"
            mr={4}
          />

          <Text mr={12}> ???</Text>
          <Image
            src={colorMode == "dark" ? white_phone : phone}
            w="20px"
            h="18px"
            mr={4}
          />
          <Text>+ 44 7803 493241</Text>
        </Flex>
        <ColorModeSwitch />
      </Flex>
      <Flex justifyContent={"space-between"} alignItems={"center"} mt={8}>
        {!isAdminRoute ? (
          <Text fontSize={"32px"} fontWeight="bold">
            MetaPlast Dashboard
          </Text>
        ) : (
          <Text fontSize={"32px"} fontWeight="bold">
            Admin Panel
          </Text>
        )}

        <Flex>
          {userInfo == "test1@test1.com" && !isAdminRoute && (
            <Button
              onClick={() => navigate("/admin")}
              mr={8}
              colorScheme="red"
              bg={colorMode === "dark" ? "red.400" : "red.400"}
            >
              Admin Panel
            </Button>
          )}

          <Button onClick={handleClick}>Log out</Button>
        </Flex>
      </Flex>
    </Box>
  );
};

export default Navigation;

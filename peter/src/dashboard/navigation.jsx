import { Box, Button, Flex, Text } from "@chakra-ui/react";
import { signOut } from "firebase/auth";
import { database } from "../firebase-config/firebase-config";
import { useNavigate } from "react-router-dom";

const Navigation = () => {
  const navigate = useNavigate();
  const handleClick = () => {
    signOut(database).then(navigate("/"));
  };
  return (
    <Box mb={8}>
      <Flex justifyContent={"space-between"} alignItems={"ce"}>
        <Text fontSize={"32px"} fontWeight="bold">
          Dashboard
        </Text>
        <Flex>
          <Button onClick={navigate("/admin")} mr={8} colorScheme="red">
            Admin Panel
          </Button>
          <Button onClick={handleClick}>Log out</Button>
        </Flex>
      </Flex>
    </Box>
  );
};

export default Navigation;

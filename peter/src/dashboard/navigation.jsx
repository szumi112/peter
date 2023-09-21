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
    <Box>
      <Flex justifyContent={"space-between"} alignItems={"ce"}>
        <Text fontSize={"32px"} fontWeight="bold">
          Dashboard
        </Text>
        <Button onClick={handleClick}>Log out</Button>
      </Flex>
    </Box>
  );
};

export default Navigation;

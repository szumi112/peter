import { Box, useColorMode, Switch } from "@chakra-ui/react";
import React, { useState } from "react";
import LoginSignUp from "./login-signup/login-signup-form";

function App() {
  const [isAuth, setIsAuth] = useState(false);
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <Box p={4}>
      <Box mb={4} display="flex" justifyContent="flex-end">
        <Switch
          isChecked={colorMode === "dark"}
          onChange={toggleColorMode}
          size="md"
          colorScheme="teal"
        />
      </Box>

      {isAuth ? (
        <div>You are logged in.</div>
      ) : (
        <LoginSignUp setIsAuth={setIsAuth} />
      )}
    </Box>
  );
}

export default App;

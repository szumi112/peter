import { Box } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import LoginSignUp from "./login-signup/login-signup-form";
import { Route, Routes } from "react-router-dom";
import Dashboard from "./dashboard/dashbord";
import { database } from "./firebase-config/firebase-config";
import { onAuthStateChanged } from "firebase/auth";
import LoginPlease from "./not-found/login-please";
import ColorModeSwitch from "./color-mode/color-mode-switch";
import Admin from "./admin/admin";

function App() {
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    onAuthStateChanged(database, (user) => {
      if (user) {
        setIsAuth(true);
      } else {
        setIsAuth(false);
      }
    });
  }, []);

  return (
    <Box>
      <Box p={4}>
        <Box mb={4} display="flex" justifyContent="flex-end">
          <ColorModeSwitch />
        </Box>
        <Routes>
          <Route path="/" element={<LoginSignUp setIsAuth={setIsAuth} />} />
          {isAuth ? (
            <Route path="/dashboard" element={<Dashboard />} />
          ) : (
            <Route path="/dashboard" element={<LoginPlease />} />
          )}
          {isAuth ? (
            <Route path="/admin" element={<Admin />} />
          ) : (
            <Route path="/admin" element={<LoginPlease />} />
          )}
        </Routes>
      </Box>
    </Box>
  );
}

export default App;

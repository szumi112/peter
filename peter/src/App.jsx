import { Box } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import LoginSignUp from "./login-signup/login-signup-form";
import { Route, Routes } from "react-router-dom";
import Dashboard from "./dashboard/dashbord";
import { database } from "./firebase-config/firebase-config";
import { onAuthStateChanged } from "firebase/auth";
import LoginPlease from "./not-found/login-please";
import Admin from "./admin/admin";
import { useUser } from "./user-context";

function App() {
  const [isAuth, setIsAuth] = useState(false);
  const { userInfo, setUserInfo } = useUser();

  useEffect(() => {
    onAuthStateChanged(database, (user) => {
      if (user) {
        setIsAuth(true);
        setUserInfo(user.email);
      } else {
        setIsAuth(false);
        setUserInfo(null);
      }
    });
  }, []);

  return (
    <Box>
      <Box p={4}>
        <Routes>
          <Route path="/" element={<LoginSignUp setIsAuth={setIsAuth} />} />
          {isAuth ? (
            <Route path="/dashboard" element={<Dashboard />} />
          ) : (
            <Route path="/dashboard" element={<LoginPlease />} />
          )}
          {isAuth &&
          [
            "test1@test1.com",
            "suzanna.k@kcharles.co.uk",
            "peter@kcharles.co.uk",
          ].includes(userInfo) ? (
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

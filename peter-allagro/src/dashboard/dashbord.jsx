import { Box } from "@chakra-ui/react";
import Navigation from "./navigation";
import DashboardDisplay from "./dashboard-display";

const Dashboard = () => {
  return (
    <>
      <Box>
        <Navigation />
        <DashboardDisplay />
      </Box>
    </>
  );
};

export default Dashboard;

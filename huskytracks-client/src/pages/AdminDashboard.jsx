import React, { useState } from "react";
import {
  Box,
  Container,
  Typography,
  Tabs,
  Tab,
  Paper
} from "@mui/material";
import DashboardNavbar from "../components/DashboardNavbar";
import Footer1 from "../components/Footer1";
import UserManagementPanel from "../components/admin/UserManagementPanel";
import CreateUserForm from "../components/admin/CreateUserForm";
import LostItemOversight from "../components/admin/LostItemOversight";
import AnalyticsDashboard from "../components/admin/AnalyticsDashboard";

const AdminDashboard = () => {
  const [tabIndex, setTabIndex] = useState(0);

  const handleTabChange = (event, newIndex) => {
    setTabIndex(newIndex);
  };

  return (
    <>
      <DashboardNavbar role="admin" />
      <Container maxWidth="xl" sx={{ py: 4, px: { xs: 2, md: 4 } }}>
        <Typography variant="h4" fontWeight={700} mb={2}>
          Admin Dashboard
        </Typography>

        <Paper elevation={2} sx={{ mb: 4 }}>
          <Tabs
            value={tabIndex}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            indicatorColor="primary"
            textColor="primary"
          >
            <Tab label="User Management" />
            <Tab label="Create User" />
            <Tab label="Lost Items Oversight" />
            <Tab label="Analytics" />
          </Tabs>
        </Paper>

        <Box>
          {tabIndex === 0 && <UserManagementPanel />}
          {tabIndex === 1 && <CreateUserForm />}
          {tabIndex === 2 && <LostItemOversight />}
          {tabIndex === 3 && <AnalyticsDashboard />}
        </Box>
      </Container>
      <Footer1 />
    </>
  );
};

export default AdminDashboard;

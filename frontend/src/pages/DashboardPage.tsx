import React from "react";

import Container from "@mui/material/Container";
import Dashboard from "components/Dashboard";

const DashboardPage: React.FC = ({ children }) => {
  return (
    <Container maxWidth="lg">
      <Dashboard />
    </Container>
  );
};

export default DashboardPage;

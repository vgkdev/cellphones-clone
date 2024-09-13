import * as React from "react";
import Grid from "@mui/material/Grid";
import Dashboard from "../components/dashboard/Dashboard";
import { violet_theme } from "../../theme/AppThemes";
import { ThemeProvider } from "@mui/material/styles";
import Customers from "../components/dashboard/Customers";

function CustomersViewport({ showStaffs }) {
  return (
    <ThemeProvider theme={violet_theme}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={12} lg={12}>
          <Customers showStaffs={showStaffs} />
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}

export default function CustomersPage({ showStaffs = false }) {
  console.log(">>>check show staffs : ", showStaffs);
  return (
    <Dashboard
      selectedIndex={showStaffs ? 8 : 3}
      childComponent={() => <CustomersViewport showStaffs={showStaffs} />}
    />
  );
}

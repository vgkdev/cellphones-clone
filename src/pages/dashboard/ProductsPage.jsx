import * as React from "react";

import Grid from "@mui/material/Grid";
import Dashboard from "../components/dashboard/Dashboard";
import { violet_theme } from "../../theme/AppThemes";
import { ThemeProvider } from "@mui/material/styles";
import ProducerAccordion from "../components/dashboard/ProducerAccordion";
import ProductAccordion from "../components/dashboard/ProductAccordion";

function ProductViewport() {
  return (
    <ThemeProvider theme={violet_theme}>
      <Grid container spacing={3}>
        {/* Chart */}
        <Grid item xs={12} md={12} lg={12}>
          <ProducerAccordion />
          <div style={{ height: 20 }} />
          <ProductAccordion />
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}

export default function ProductPage() {
  return <Dashboard selectedIndex={1} childComponent={ProductViewport} />;
}

import * as React from "react";

import Dashboard from "../components/dashboard/Dashboard";
import {
  Box,
  Button,
  Paper,
  ThemeProvider,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import { violet_theme } from "../../theme/AppThemes";
import UnauthorizedPage from "../../components/UnauthorizedEntryPage";
import { useSelector } from "react-redux";
import { Add, ExpandMore } from "@mui/icons-material";
import AccessoryForm from "../../components/forms/AccessoryForm";
import PlusIcon from "@mui/icons-material/Add";
import { AccessoryTable } from "../../components/tables/AccessoryTable";

function ViewPort() {
  const user = useSelector((state) => state.user.user);
  const [open, setOpen] = React.useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  if (!user) {
    return <UnauthorizedPage />;
  }

  return (
    <ThemeProvider theme={violet_theme}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "start",
          height: "100%",
          width: "100%",
          gap: 2,
        }}
      >
        <Paper elevation={3} sx={{ width: "100%" }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "start",
              alignItems: "start",
              p: 2,
            }}
          >
            <Typography variant="h4" color="primary">
              Accessories Page
            </Typography>
            <Typography variant="body1" sx={{ mt: 1 }} fontWeight={"bold"}>
              {"Welcome, " + user.displayName + "!"}
            </Typography>
          </Box>
        </Paper>

        <Accordion>
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Button startIcon={<PlusIcon />}>Add new</Button>
          </AccordionSummary>
          <AccordionDetails>
            <AccessoryForm />
          </AccordionDetails>
        </Accordion>

        <Paper elevation={3} sx={{ width: "100" }}>
          <AccessoryTable />
        </Paper>
      </Box>
    </ThemeProvider>
  );
}

export default function AccessoriesPage() {
  return <Dashboard selectedIndex={7} childComponent={ViewPort} />;
}

import * as React from "react";

import Dashboard from "../components/dashboard/Dashboard";
import {
  Box,
  Button,
  Paper,
  ThemeProvider,
  Modal,
  TextField,
  Typography,
} from "@mui/material";
import { violet_theme } from "../../theme/AppThemes";
import { Add } from "@mui/icons-material";
import { Event } from "../../models/Event";
import EventForm from "../../components/forms/EventForm";
import EventsTable from "../../components/tables/EventsTable";
import { useState } from "react";

function ViewPort() {
  const [open, setOpen] = React.useState(false);
  const [onFocusEvent, setOnFocusEvent] = useState("");

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setOnFocusEvent("");
  };

  return (
    <ThemeProvider theme={violet_theme}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
        }}
        gap={2}
      >
        <Paper
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "start",
            width: "100%",
          }}
        >
          <Button
            startIcon={<Add />}
            variant="contained"
            color="primary"
            sx={{
              margin: "10px",
            }}
            onClick={handleOpen}
          >
            Add event
          </Button>
        </Paper>

        <Paper
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "start",
            width: "100%",
          }}
        >
          <Typography
            variant="h4"
            sx={{
              margin: "10px",
            }}
          >
            Events table
          </Typography>

          <EventsTable
            onEditEvent={(eventId) => {
              setOnFocusEvent(eventId);
              handleOpen();
            }}
          />
        </Paper>

        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="add-event-modal"
          aria-describedby="add-event-modal-description"
        >
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              bgcolor: "background.paper",
              border: "2px solid #000",
              boxShadow: 24,
              p: 4,
              justifyContent: "center",
              alignContent: "center",
              overflow: "auto",
              height: "80vh",
              width: "50vw",
            }}
          >
            <EventForm eventId={onFocusEvent} />
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignContent: "center",
              }}
            >
              <Button
                variant="contained"
                color="primary"
                sx={{ mt: 2 }}
                onClick={handleClose}
              >
                Cancel
              </Button>
            </Box>
          </Box>
        </Modal>
      </Box>
    </ThemeProvider>
  );
}

export default function EventPage() {
  return <Dashboard selectedIndex={5} childComponent={ViewPort} />;
}

import * as React from "react";
import { useState } from "react";
import Dashboard from "../components/dashboard/Dashboard";
import {
  Box,
  Button,
  Paper,
  ThemeProvider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import { violet_theme } from "../../theme/AppThemes";
import { Add } from "@mui/icons-material";

import VoucherForm from "../../components/forms/VoucherForm";
import VouchersTable from "../../components/tables/VouchersTable";

function ViewPort() {
  const [open, setOpen] = useState(false);
  const [resetForm, setResetForm] = useState(false);
  const [onFocusVoucherId, setOnFocusVoucherId] = useState("");

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = (event, reason) => {
    if (reason === "backdropClick") return; // Prevent the dialog from closing when clicking on the backdrop
    setOpen(false);
    handleResetForm(); // Reset the form when the dialog is closed
    setOnFocusVoucherId(""); // Reset the voucher id
  };

  const handleResetForm = () => {
    setResetForm((prevState) => !prevState); // Toggle the state to trigger a reset
  };

  return (
    <ThemeProvider theme={violet_theme}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "start",
          alignItems: "start",
          flexDirection: "column",
        }}
        gap={2}
        width={"100%"}
      >
        <Paper
          sx={{
            display: "flex",
            justifyContent: "start",
            alignItems: "start",
            width: "100%",
          }}
          elevation={3}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "start",
              alignItems: "start",
            }}
            width="100%"
          >
            <Button
              startIcon={<Add />}
              variant="contained"
              color="primary"
              sx={{
                margin: "10px",
              }}
              onClick={handleClickOpen}
            >
              Add Voucher
            </Button>
          </Box>
        </Paper>

        <Paper
          sx={{
            display: "flex",
            justifyContent: "start",
            alignItems: "start",
            width: "100%",
          }}
          elevation={3}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "start",
              alignItems: "start",
              width: "100%",
            }}
          >
            {" "}
            <VouchersTable
              onEditVoucher={(id) => {
                setOnFocusVoucherId(id);
                setOpen(true);
              }}
            />
          </Box>
        </Paper>

        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>Add New Voucher</DialogTitle>
          <DialogContent>
            <DialogContentText>
              To add a new voucher, please enter the details here.
            </DialogContentText>
            <VoucherForm voucherId={onFocusVoucherId} />
            {/* Use the VoucherForm component and pass the onCreate handler */}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>

            {/* Call the handleCreateVoucher directly */}
          </DialogActions>
        </Dialog>
      </Box>
    </ThemeProvider>
  );
}

export default function VoucherPage() {
  return <Dashboard selectedIndex={6} childComponent={ViewPort} />;
}

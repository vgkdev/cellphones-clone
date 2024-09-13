import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import {
  Box,
  Button,
  Modal,
  TextField,
  Typography,
  Divider,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  ThemeProvider,
  Paper,
  DialogActions,
  Select,
  MenuItem,
} from "@mui/material";
import {
  addUserToFirebase,
  deleteUserInFirebase,
  getAllUsersFromFirebase,
  handleUpdateRole,
  updateUserInFirebase,
} from "../../../db/dbUser";
import { toast, ToastContainer } from "react-toastify";
import { useSnackbarUtils } from "../../../utils/useSnackbarUtils";
import { violet_theme } from "../../../theme/AppThemes";
import NotificationAddIcon from "@mui/icons-material/NotificationAdd";
import { Edit, Send } from "@mui/icons-material";
import SendUserNotificationForm from "../../../components/forms/SendUserNotificationForm";
import { getAllDefaultNotificationIcons } from "../../../db/storageImage";

export default function Customers({ showStaffs }) {
  const columns = [
    { field: "id", headerName: "ID", width: 200 },
    { field: "firstName", headerName: "First name", width: 130 },
    { field: "lastName", headerName: "Last name", width: 130 },
    { field: "email", headerName: "Email", width: 150 },
    // {
    //   field: "isAdmin",
    //   headerName: "Role",
    //   width: 130,
    //   valueGetter: (value, row) =>
    //     row.isManager ? "Manager" : row.isStaff ? "Staff" : "Customer",
    // },
    {
      field: "isAdmin",
      headerName: "Role",
      width: 130,
      renderCell: (params) => {
        const { row } = params;

        const handleRoleChange = (event) => {
          const newRole = event.target.value;
          handleUpdateRole(
            row.id,
            newRole,
            (newUserList) => {
              const listUsers = [];
              newUserList.forEach((doc) => {
                const user = doc.data();
                console.log(user);

                const shouldShowUser = showStaffs
                  ? user.isStaff && !user.isManager
                  : user.isCustomer && !user.isManager;

                if (shouldShowUser) {
                  listUsers.push(user);
                }
              });
              setRows(listUsers);
              showSnackbar("User role updated successfully", "success");
            },
            (error) => {
              console.error("Failed to update user role:", error);
              showSnackbar("Failed to update user role", "error");
            }
          );
        };

        return (
          <Select
            value={row.isStaff ? "Staff" : "Customer"}
            onChange={handleRoleChange}
            fullWidth
            variant="standard"
          >
            <MenuItem value="Staff">Staff</MenuItem>
            <MenuItem value="Customer">Customer</MenuItem>
          </Select>
        );
      },
    },
    {
      field: "edit",
      headerName: "Actions",
      width: "100%",
      sortable: false,
      renderCell: (params) => (
        <>
          <Button
            variant="contained"
            color="warning"
            size="small"
            sx={{ mr: "10px" }}
            onClick={() => handleShowModalEditUser(params.row)}
            startIcon={<Edit />}
          >
            Edit
          </Button>
          <Button
            variant="contained"
            color="error"
            size="small"
            onClick={() => {
              console.log(">>>check id: ", params.row.id);
              setOnFocusUser(params.row);
              handleSendNotification(params.row.id);
            }}
            startIcon={<NotificationAddIcon />}
          >
            Send Notification
          </Button>
        </>
      ),
    },
  ];

  const [rows, setRows] = useState([]);
  const [open, setOpen] = useState(false);
  const [openSendNotificationDialog, setOpenSendNotificationDialog] =
    useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isEdit, setIsEdit] = useState(false);
  const [id, setId] = useState("");
  const [onFocusUser, setOnFocusUser] = useState(null);

  const { showSnackbar } = useSnackbarUtils();

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const resetAllFields = () => {
    setFirstName("");
    setLastName("");
    setEmail("");
    setPassword("");
  };

  const handleAddUser = async () => {
    try {
      console.log(firstName, lastName, email, password);
      const result = await addUserToFirebase({
        firstName,
        lastName,
        email,
        password,
      });

      console.log(">>>check res: ", result);

      if (result) {
        console.log(">>>check res in add user: ", result);
        showSnackbar("Use has been added successfully", "success");
      } else {
        showSnackbar("Something went wrong!", "error");
        console.log("No such document!");
      }

      //get new list
      const userData = await getAllUsersFromFirebase();

      const listUsers = [];
      userData.forEach((doc) => {
        const user = doc.data();
        console.log(user);

        const shouldShowUser = showStaffs
          ? user.isStaff && !user.isManager
          : user.isCustomer && !user.isManager;

        if (shouldShowUser) {
          listUsers.push(user);
        }
        // listUsers.push(doc.data());
      });

      setRows(listUsers);
      handleClose();
    } catch (error) {
      console.error("Error adding user:", error);
    }
  };

  const handleUpdateUser = async () => {
    try {
      console.log(firstName, lastName);
      const result = await updateUserInFirebase({
        firstName: firstName,
        lastName: lastName,
        id: id,
      });

      console.log(">>>check res: ", result);

      if (result) {
        showSnackbar("Use has been updated successfully", "success");
      } else {
        showSnackbar("Something went wrong!", "error");
      }

      //get new list
      const userData = await getAllUsersFromFirebase();

      const listUsers = [];
      userData.forEach((doc) => {
        const user = doc.data();
        console.log(user);

        const shouldShowUser = showStaffs
          ? user.isStaff && !user.isManager
          : user.isCustomer && !user.isManager;

        if (shouldShowUser) {
          listUsers.push(user);
        }
        // listUsers.push(doc.data());
      });
      setRows(listUsers);
      handleClose();
    } catch (error) {
      console.error("Error adding user:", error);
    }
  };

  // const handleDeleteUser = async (id) => {
  //   try {
  //     const result = deleteUserInFirebase(id);
  //     if (result) {
  //       showSnackbar("Use has been updated successfully", "success");
  //     } else {
  //       showSnackbar("Something went wrong!", "error");
  //     }

  //     //get new list
  //     const userData = await getAllUsersFromFirebase();

  //     const listUsers = [];
  //     userData.forEach((doc) => {
  //       console.log(doc.data());
  //       listUsers.push(doc.data());
  //     });
  //     setRows(listUsers);
  //   } catch (error) {}
  // };

  const handleShowModalEditUser = (row) => {
    console.log(">>>check id: ", row);

    setFirstName(row.firstName);
    setLastName(row.lastName);
    setEmail(row.email);
    setId(row.id);
    setPassword("");

    setIsEdit(true);
    handleOpen();
  };

  const handleSendNotification = (id) => {
    // Open dialog here
    setOpenSendNotificationDialog(true);
    console.log("Sending notification to user with ID:", id);
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const userData = await getAllUsersFromFirebase();

        const listUsers = [];
        userData.forEach((doc) => {
          const user = doc.data();
          console.log(user);

          const shouldShowUser = showStaffs
            ? user.isStaff && !user.isManager
            : user.isCustomer && !user.isManager;

          if (shouldShowUser) {
            listUsers.push(user);
          }
          // listUsers.push(doc.data());
        });
        setRows(listUsers);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    }

    fetchData();
  }, []);

  return (
    <ThemeProvider theme={violet_theme}>
      <Paper elevation={3}>
        <Box sx={{ width: "100%" }}>
          <Button
            variant="contained"
            onClick={() => {
              resetAllFields();
              setIsEdit(false);
              handleOpen();
            }}
            sx={{
              margin: "auto",
              display: "block",
              mb: "15px",
            }}
          >
            Add
          </Button>

          <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: 700,
                bgcolor: "background.paper",
                boxShadow: 24,
                p: 4,
                borderRadius: "10px",
              }}
            >
              <Typography variant="h5" gutterBottom>
                Add User
              </Typography>
              <Divider />

              <Box noValidate sx={{ mt: 3 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      value={firstName}
                      onChange={(event) => setFirstName(event.target.value)}
                      autoComplete="given-name"
                      name="firstName"
                      required
                      fullWidth
                      id="firstName"
                      label="First name"
                      autoFocus
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      value={lastName}
                      onChange={(event) => setLastName(event.target.value)}
                      required
                      fullWidth
                      id="lastName"
                      label="Last name"
                      name="lastName"
                      autoComplete="family-name"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      required
                      fullWidth
                      id="email"
                      label="Email"
                      name="email"
                      autoComplete="email"
                      disabled={isEdit}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      required
                      fullWidth
                      name="password"
                      label="Password"
                      type="password"
                      id="password"
                      autoComplete="new-password"
                      disabled={isEdit}
                    />
                  </Grid>
                </Grid>

                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Button
                      type="submit"
                      fullWidth
                      variant="contained"
                      sx={{ mt: 3, mb: 2 }}
                      onClick={() =>
                        isEdit ? handleUpdateUser() : handleAddUser()
                      }
                    >
                      {isEdit ? "Update" : "Add"}
                    </Button>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Button
                      fullWidth
                      variant="outlined"
                      sx={{ mt: 3, mb: 2 }}
                      onClick={handleClose}
                    >
                      Close
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            </Box>
          </Modal>
          <DataGrid rows={rows} columns={columns} pageSize={5} />
          <ToastContainer position="top-center" autoClose={3000} />

          <Dialog
            onClose={() => {
              setOpenSendNotificationDialog(false);
            }}
            open={openSendNotificationDialog}
          >
            <DialogTitle sx={{ color: "primary" }}>
              New Notification to{" "}
              {onFocusUser?.firstName + " " + onFocusUser?.lastName}
            </DialogTitle>
            <DialogContent>
              <Typography gutterBottom></Typography>
              {onFocusUser && (
                <SendUserNotificationForm userId={onFocusUser.id} />
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenSendNotificationDialog(false)}>
                Cancel
              </Button>
            </DialogActions>
          </Dialog>
        </Box>
      </Paper>
    </ThemeProvider>
  );
}

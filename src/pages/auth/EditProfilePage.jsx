import { Box, Typography } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import * as React from "react";
import { violet_theme } from "../../theme/AppThemes";
import { Button, TextField, Divider, Grid } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useSnackbarUtils } from "../../utils/useSnackbarUtils";
import { updateUser, updateUserInFirebase } from "../../db/dbUser";
import editBotImg from "../../assets/images/bot/hi.png";
import { AccountCircle } from "@mui/icons-material";
import AvatarSelection from "../components/user/AvatarSelection";
import { updateUser as reduxUpdateUser } from "../../store/actions/userAction";

export default function EditProfilePage() {
  const user = useSelector((state) => state.user.user);
  const { showSnackbar } = useSnackbarUtils();
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState(user?.firstName || "");
  const [lastName, setLastName] = useState(user?.lastName || "");
  const [displayName, setDisplayName] = useState(user?.displayName || "");
  const dispatch = useDispatch();

  const handleUpdateUser = async () => {
    try {
      const newUserData = {
        firstName: firstName,
        lastName: lastName,
        displayName: displayName,
      };

      const mergedUserData = { ...user, ...newUserData };

      updateUser(
        mergedUserData,
        () => {
          dispatch(reduxUpdateUser(mergedUserData));
          showSnackbar("User has been updated successfully", "success");
        },
        (error) => {
          showSnackbar("Something went wrong!", "error");
        }
      );
    } catch (error) {
      console.error("Error adding user:", error);
    }
  };

  if (!user) {
    navigate("/shopping/sign-in");
  }

  return (
    <ThemeProvider theme={violet_theme}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "start",
            width: { sm: "100%", md: "80%" },
            height: "100%",
          }}
        >
          <AccountCircle sx={{ fontSize: 50 }} color="primary" />
          {/* <Typography variant="h5" color="primary">
            Edit Profile
          </Typography> */}

          <img
            src={editBotImg}
            alt="edit"
            style={{
              width: "200px",
              height: "auto",
            }}
          />

          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "column", md: "row" },
              alignItems: "center",
              justifyContent: "start",
              width: "100%",
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "start",
                width: { sm: "100%", md: "40%" },
                height: "100%",
              }}
              marginRight={2}
            >
              <AvatarSelection />
            </Box>

            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "start",
                width: { sm: "100%", md: "60%" },
              }}
            >
              <Divider />

              <Box noValidate sx={{ mt: 3 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      value={user.id}
                      required
                      fullWidth
                      id="id"
                      disabled={true}
                      label="ID"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      value={user.firstName}
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
                      value={user.lastName}
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
                      value={displayName}
                      required
                      fullWidth
                      id="displayName"
                      label="Display name"
                      name="displayName"
                      autoComplete="displayName"
                      onChange={(event) => setDisplayName(event.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      value={user.email}
                      required
                      fullWidth
                      id="email"
                      label="Email"
                      name="email"
                      autoComplete="email"
                      disabled={true}
                    />
                  </Grid>
                </Grid>

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2, width: "100%" }}
                  onClick={() => handleUpdateUser()}
                >
                  Save
                </Button>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

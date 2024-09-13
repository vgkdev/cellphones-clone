import * as React from "react";

import { violet_theme } from "../../../theme/AppThemes";
import {
  Box,
  Button,
  TextField,
  ThemeProvider,
  Typography,
} from "@mui/material";
import { useSetUserAvatar } from "../../../db/dbUser";
import { useSnackbarUtils } from "../../../utils/useSnackbarUtils";
import { useSelector } from "react-redux";

export default function AvatarInputUrl() {
  const [url, setUrl] = React.useState("");
  const user = useSelector((state) => state.user.user);

  const { setUserAvatar } = useSetUserAvatar();
  const { showSnackbar } = useSnackbarUtils();

  const handleSave = () => {
    console.log(">>>url: ", url);
    if (url === "") {
      showSnackbar("Please enter a valid URL", "error");
      return;
    }
    setUserAvatar(
        user,
        url,
        () => {
          showSnackbar("Avatar has been updated successfully", "success");
        },
        (error) => {
          showSnackbar("Something went wrong!", "error");
        }
      );
  };

  return (
    <ThemeProvider theme={violet_theme}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
          gap: 2,
        }}
      >
        <TextField
          id="outlined-basic"
          label="Url"
          variant="outlined"
          color="primary"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          fullWidth
        />

        <Button variant="outlined" color="primary" onClick={handleSave}>
          Save
        </Button>
      </Box>
    </ThemeProvider>
  );
}

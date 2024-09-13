import * as React from "react";

import { violet_theme } from "../../../theme/AppThemes";
import {
  Box,
  Button,
  TextField,
  ThemeProvider,
  Typography,
} from "@mui/material";
import { useSelector } from "react-redux";
import { useSetUserAvatar } from "../../../db/dbUser";
import { useSnackbarUtils } from "../../../utils/useSnackbarUtils";
import { uploadUserAvatar } from "../../../db/storageImage";

const isImageFile = (file) => {
  const acceptedImageTypes = ["image/gif", "image/jpeg", "image/png"];

  return file && acceptedImageTypes.includes(file["type"]);
};

export default function AvatarUploader() {
  const user = useSelector((state) => state.user.user);
  const [selectedFile, setSelectedFile] = React.useState(null);

  const { setUserAvatar } = useSetUserAvatar();
  const { showSnackbar } = useSnackbarUtils();

  const setAvatarUrl = (url) => {
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

  const handleSave = () => {
    if (selectedFile === null) {
      showSnackbar("Please select a file first!", "error");
      return;
    }

    if (!isImageFile(selectedFile)) {
      showSnackbar("Please select a valid image file!", "error");
      return;
    }

    uploadUserAvatar(
      user.id,
      selectedFile,
      (url) => {
        setAvatarUrl(url);
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
          variant="outlined"
          color="primary"
          fullWidth
          type="file"
          onChange={(e) => setSelectedFile(e.target.files[0])}
        />

        <Button variant="outlined" color="primary" onClick={handleSave}>
          Save
        </Button>
      </Box>
    </ThemeProvider>
  );
}

import * as React from "react";

import { violet_theme } from "../../../theme/AppThemes";
import { Box, MenuItem, Select, ThemeProvider } from "@mui/material";
import { useSelector } from "react-redux";
import { useState } from "react";
import { useEffect } from "react";
import { getAllDefaultUserAvatars } from "../../../db/storageImage";
import { useSetUserAvatar } from "../../../db/dbUser";
import { useSnackbarUtils } from "../../../utils/useSnackbarUtils";

export default function DefaultAvatarSelection() {
  const user = useSelector((state) => state.user.user);
  const [images, setImages] = useState([]);
  const [isDefaultAvatar, setIsDefaultAvatar] = useState(true);
  const [selectedImage, setSelectedImage] = useState(
    images.includes(user.avatarImageUrl) ? user.avatarImageUrl : ""
  );

  const { setUserAvatar } = useSetUserAvatar();
  const { showSnackbar } = useSnackbarUtils();

  const handleSelectAvatar = (newValue) => {
    if (newValue === "") {
      showSnackbar("Please enter select an avatar first!", "error");
      return;
    }
    setUserAvatar(
      user,
      newValue,
      () => {
        showSnackbar("Avatar has been updated successfully", "success");
        setSelectedImage(newValue);
      },
      (error) => {
        showSnackbar("Something went wrong!", "error");
      }
    );
  };

  useEffect(() => {
    getAllDefaultUserAvatars(
      (images) => {
        setImages(images);
        if (images.includes(user.avatarImageUrl)) {
          setIsDefaultAvatar(true);
          setSelectedImage(user.avatarImageUrl);
        } else {
          setIsDefaultAvatar(false);
          setSelectedImage("");
        }
      },
      (error) => {
        console.log("Error getting images: ", error);
      }
    );
  }, []);

  return (
    <ThemeProvider theme={violet_theme}>
      <Box
        display="flex"
        flexDirection="row"
        alignItems="center"
        justifyContent="center"
        width="100%"
        sx={{
          flexWrap: "wrap",
        }}
      >
        <Select
          value={isDefaultAvatar ? selectedImage : ""}
          onChange={(e) => handleSelectAvatar(e.target.value)}
          renderValue={(value) => (
            <img
              src={value}
              alt="avatar"
              width="50"
              height="50"
              style={{ borderRadius: "50%" }}
            />
          )}
          fullWidth
        >
          <MenuItem value={""}>Select Default Avatar</MenuItem>
          {images.map((image, index) => (
            <MenuItem key={index} value={image}>
              <img
                src={image}
                alt="avatar"
                width="50"
                height="50"
                style={{ borderRadius: "50%" }}
              />
            </MenuItem>
          ))}
        </Select>
      </Box>
    </ThemeProvider>
  );
}

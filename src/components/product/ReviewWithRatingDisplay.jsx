import * as React from "react";

import {
  Avatar,
  Box,
  Chip,
  Dialog,
  Grid,
  Rating,
  Stack,
  Typography,
} from "@mui/material";
import { useSelector } from "react-redux";
import { getUserById } from "../../db/dbUser";
import { set } from "firebase/database";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import VerifiedIcon from "@mui/icons-material/Verified";
import { useState } from "react";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { useSnackbarUtils } from "../../utils/useSnackbarUtils";

export default function ReviewWithRatingDisplay({ review }) {
  const [user, setUser] = React.useState(null);
  const [purchased, setPurchased] = React.useState(false);
  const [openReviewImageModal, setOpenReviewImageModal] = useState(false);
  const [selectedPreviewImage, setSeletedPreviewImage] = useState(null);
  const {showSnackbar} = useSnackbarUtils();

  const handleClickOpen = (url) => {
    setSeletedPreviewImage(url);
    setOpenReviewImageModal(true);
  };

  const handleCloseReviewImageModal = () => {
    setOpenReviewImageModal(false);
  };

  // debugger;
  React.useEffect(() => {
    if (user !== null) return;
    getUserById(
      review.userId,
      (res) => {
        setUser(res);
        setPurchased(res.purchasedItems.includes(review.productId));
      },
      (error) => {
        console.error("Failed to get user " + error);
        showSnackbar("Failed to get user " + error, "warning", true);
      }
    );
  }, []);

  return (
    <Box sx={{ mt: 2 }} width="100%">
      <Grid container>
        {/* Left*/}
        <Grid xs={4} md={3} item>
          <Box
            sx={{
              display: "flex",
              alignItems: "start",
            }}
            flexDirection="column"
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
              }}
              flexDirection="row"
            >
              <Avatar src={user?.avatarImageUrl} />
              <Typography variant="caption">
                {user ? user.displayName : "Anonymous"}
              </Typography>
            </Box>
            {user?.isStaff || user?.isManager ? (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                }}
                flexDirection="row"
              >
                <AdminPanelSettingsIcon
                  color={user.isManager ? "error" : "success"}
                />
                <Typography variant="caption">
                  {user.isManager ? "Admin" : "Staff"}
                </Typography>
              </Box>
            ) : null}

            {/* Date */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                flexDirection: "row",
                gap: 1,
                m: 1,
              }}
            >
              {" "}
              <AccessTimeIcon color="primary" fontSize="16" />
              <Typography variant="caption">
                {new Date(review.lastUpdate).toLocaleDateString()}
              </Typography>
            </Box>
          </Box>
        </Grid>
        {/* Right */}
        <Grid xs={8} md={9} item>
          <Box
            sx={{
              display: "flex",
              alignItems: "start",
            }}
            flexDirection="row"
          >
            <Rating
              name="read-only"
              value={review.score}
              readOnly
              precision={0.5}
              size="small"
            />
            <Box
              sx={{
                display: "flex",
                alignItems: "start",
              }}
              flexDirection="row"
              flexWrap={"wrap"}
            >
              {review.productOpinions.map((opinion, index) => (
                <Chip key={index} label={opinion} size="small" />
              ))}
            </Box>
          </Box>
          <Box>
            <Typography variant="body2">{review.content}</Typography>
          </Box>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
            }}
            flexDirection="row"
          >
            {purchased ? (
              <VerifiedIcon color="success" sx={{ fontSize: 20 }} />
            ) : null}
            <Typography variant="caption">
              {purchased ? "Purchased" : "Not purchased"}
            </Typography>
          </Box>

          {/* Attached images */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
            }}
            flexDirection="row"
          >
            {review.attachedImageUrls.map((url, index) => (
              <img
                key={index}
                src={url}
                alt={`review-${index}`}
                style={{
                  width: 100,
                  height: 100,
                  objectFit: "cover",
                  borderRadius: 5,
                  margin: 1,
                }}
                onClick={() => handleClickOpen(url)}
              />
            ))}
          </Box>

          <Dialog
            open={openReviewImageModal}
            onClose={handleCloseReviewImageModal}
          >
            <img
              src={selectedPreviewImage}
              alt="selected"
              style={{ maxWidth: "100%", maxHeight: "100%" }}
            />
          </Dialog>
        </Grid>
      </Grid>
    </Box>
  );
}

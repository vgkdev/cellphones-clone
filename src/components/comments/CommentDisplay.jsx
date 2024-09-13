import { Comment } from "../../models/Comment";

import React, { useState, useEffect } from "react";
import {
  ThemeProvider,
  Box,
  TextField,
  Avatar,
  Typography,
  Chip,
} from "@mui/material";
import {
  AccessTime,
  AdminPanelSettings,
  ExpandLess,
  ExpandMore,
} from "@mui/icons-material";
import { violet_theme } from "../../theme/AppThemes";
import { makeStyles } from "@mui/styles";
import ThumbUpOffAltIcon from "@mui/icons-material/ThumbUpOffAlt";
import ThumbDownOffAltIcon from "@mui/icons-material/ThumbDownOffAlt";
import { useSelector } from "react-redux";
import { useSnackbarUtils } from "../../utils/useSnackbarUtils";
import {
  COMMENT_COLLECTION,
  COMMENT_COLLECTION_PATH,
  handleDislikeComment,
  handleLikeComment,
} from "../../db/dbComment";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../../config/firebase";
import NewComment from "./NewComment";
import { getUserById } from "../../db/dbUser";

const useStyles = makeStyles({
  root: {
    cursor: "pointer",
    "&:hover": {
      textDecoration: "underline",
      fontWeight: "bold",
    },
  },
});

const CommentsDisplay = ({
  commentId,
  userId,
  product,
  replyingTo,
  setReplyingTo,
  isReply = false,
}) => {
  const classes = useStyles();
  const user = useSelector((state) => state.user.user);
  const { showSnackbar } = useSnackbarUtils();
  const [comment, setComment] = useState(null);
  const [author, setAuthor] = useState(null);

  const onLikeButtonClicked = (comment) => {
    if (!user) {
      showSnackbar("Please login to like a comment", "warning");
      return;
    }
    handleLikeComment(user.id, comment, null, (error) => {
      showSnackbar(error, "error");
    });
  };

  const onDislikeButtonClicked = (comment) => {
    if (!user) {
      showSnackbar("Please login to dislike a comment", "warning");
      return;
    }
    handleDislikeComment(user.id, comment, null, (error) => {
      showSnackbar(error, "error");
    });
  };

  useEffect(() => {
    if (comment) return;
    if (commentId === undefined || commentId === null) return;
    const unsub = onSnapshot(
      doc(db, COMMENT_COLLECTION_PATH, commentId),

      (d) => {
        setComment(d.data());
      }
    );
    return () => {
      unsub();
    };
  }, [commentId]);

  useEffect(() => {
    if (!comment) return;

    if(comment.author === "") return;

    getUserById(
      comment.author,
      (user) => {
        setAuthor(user);
      },
      (error) => {
        console.error("Failed to get user " + error);
      }
    );
  }, [comment]);

  if (!comment) return null;

  return (
    <ThemeProvider theme={violet_theme}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            borderLeft: comment.replies.length > 0 ? "1px solid" : "none",
          }}
        >
          <Avatar
            sx={{ width: 24, height: 24, marginRight: 1 }}
            alt={comment.author}
            src={author?.avatarImageUrl}
          />
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "start",
              alignItems: "start",
              gap: 1,
              width: "100%",
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                width: "100%",
              }}
            >
              <Typography
                variant="caption"
                color="text.secondary"
                fontSize="16px"
                sx={{
                  color: "primary.main",
                }}
                fontWeight="bold"
              >
                {!author
                  ? "Guest"
                  : user?.id === comment.author
                  ? "You"
                  : author?.displayName}
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  direction: "row",
                }}
              >
                {author?.isStaff || author?.isManager ? (
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                    }}
                    flexDirection="row"
                  >
                    <AdminPanelSettings
                      color={author.isManager ? "error" : "success"}
                    />
                    <Typography variant="caption">
                      {author.isManager ? "Admin" : "Staff"}
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
                  <AccessTime color="primary" fontSize="16" />
                  <Typography variant="caption">
                    {new Date(comment.lastModifiedAt).toLocaleDateString()}
                  </Typography>
                </Box>
              </Box>

              {comment?.content !== "" && (
                <TextField
                  multiline
                  fullWidth
                  value={comment.content}
                  InputProps={{
                    readOnly: true,
                  }}
                />
              )}
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "start",
                  alignItems: "start",
                  gap: 1,
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "start",
                    alignItems: "start",
                    gap: 1,
                  }}
                >
                  {comment.attachedImages.map((imageUrl, index) => (
                    <Box
                      sx={{
                        position: "relative",
                        display: "flex",
                      }}
                      key={imageUrl + index}
                      gap={1}
                    >
                      <img
                        src={imageUrl}
                        width="100px"
                        height="100px"
                        alt=":("
                        style={{ borderRadius: "8px" }}
                      />
                    </Box>
                  ))}
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "start",
                    alignItems: "start",
                    gap: 1,
                  }}
                >
                  {comment.attachedGifs.map((gif, index) => (
                    <Box
                      sx={{
                        position: "relative",
                      }}
                      key={gif.id + index}
                    >
                      <img
                        src={gif.preview.url}
                        width={gif.preview.width}
                        height={gif.preview.height}
                        alt={gif.description}
                        style={{ borderRadius: "8px" }}
                      />
                    </Box>
                  ))}
                </Box>
              </Box>
            </Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "start",
                alignItems: "start",
                gap: 1,
              }}
            >
              <Chip
                icon={<ThumbUpOffAltIcon />}
                label={comment.likes.length}
                color="primary"
                variant={
                  comment.likes.includes(user?.id) ? "filled" : "outlined"
                }
                size="small"
                sx={{
                  cursor: "pointer",
                }}
                onClick={() => onLikeButtonClicked(comment)}
              />
              <Chip
                icon={<ThumbDownOffAltIcon />}
                label={comment.dislikes.length}
                color="primary"
                variant={
                  comment.dislikes.includes(user?.id) ? "filled" : "outlined"
                }
                size="small"
                sx={{
                  cursor: "pointer",
                }}
                onClick={() => onDislikeButtonClicked(comment)}
              />
              <Typography
                variant="caption"
                color="text.secondary"
                className={classes.root}
                fontSize={16}
                onClick={() => {
                  if (replyingTo === comment.id) {
                    setReplyingTo("");
                  } else {
                    setReplyingTo(comment.id);
                  }
                }}
              >
                Reply
              </Typography>
            </Box>
          </Box>
        </Box>
        {/* reply form */}
        {replyingTo === comment.id && (
          <NewComment
            product={null}
            userId={userId}
            replyingTo={comment.id}
            setReplyingTo={setReplyingTo}
            parentComment={comment}
            onReplyAdded={() => {
              setReplyingTo("");
            }}
          />
        )}
        {/* recursively render replies */}
        {comment.replies.map((replyId, index) => (
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
            }}
            key={"reply" + replyId}
          >
            <Box
              sx={{
                width: "48px",
                borderTop: "1px solid",
                borderLeft:
                  index !== comment.replies.length - 1 ? "1px solid" : "none",
              }}
            />
            <CommentsDisplay
              commentId={replyId}
              userId={userId}
              product={product}
              replyingTo={replyingTo}
              setReplyingTo={setReplyingTo}
              isReply={true}
            />
          </Box>
        ))}
      </Box>
    </ThemeProvider>
  );
};

export default CommentsDisplay;

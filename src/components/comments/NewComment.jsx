import {
  Box,
  IconButton,
  InputAdornment,
  Popover,
  Tab,
  Tabs,
  TextField,
  ThemeProvider,
} from "@mui/material";
import { violet_theme } from "../../theme/AppThemes";
import { Send } from "@mui/icons-material";
import EmojiEmotionsIcon from "@mui/icons-material/EmojiEmotions";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import GifBoxIcon from "@mui/icons-material/GifBox";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { Comment } from "../../models/Comment";
import { useState } from "react";
import Picker from "emoji-picker-react";
import GifPicker from "gif-picker-react";
import CancelIcon from "@mui/icons-material/Cancel";
import { useEffect } from "react";
import { getSubSystem } from "../../db/dbSubSystem";
import { useSnackbarUtils } from "../../utils/useSnackbarUtils";
import { set } from "firebase/database";
import { addProductComment, addReplyToComment } from "../../db/dbComment";
import { useDispatch } from "react-redux";
import { updateProductSuccess } from "../../store/slices/productsSlice";

const POPUP_STATE = {
  CLOSE: 0,
  EMOJI: 1,
  GIF: 2,
  IMAGE: 3,
};

export default function NewComment({ userId, product, parentComment, onReplyAdded=null }) {
  const { showSnackbar } = useSnackbarUtils();

  const getNewComment = () => {
    return {
      ...new Comment().data(),
      author: userId,
    };
  };

  const [comment, setComment] = useState(getNewComment());
  const [popupState, setPopupState] = useState(POPUP_STATE.CLOSE);
  const [tenorApiKey, setTenorApiKey] = useState(null);
  const [inputUrl, setInputUrl] = useState("");
  const dispatch = useDispatch();

  const [anchorEl, setAnchorEl] = useState(null);

  const handleOpenSelector = (event, type) => {
    setAnchorEl(event.currentTarget);
    if (type === popupState) {
      setPopupState(POPUP_STATE.CLOSE);
      return;
    }
    setPopupState(type);
  };

  const handleCloseSelector = () => {
    setAnchorEl(null);
    setPopupState(POPUP_STATE.CLOSE);
  };

  const onEmojiClick = (emojiObject) => {
    setComment({ ...comment, content: comment.content + emojiObject.emoji });
  };

  const onGifClick = (gifObject) => {
    setComment({
      ...comment,
      attachedGifs: [...comment.attachedGifs, gifObject],
    });
    handleCloseSelector();
  };

  const removeGif = (index) => {
    const newGifs = [...comment.attachedGifs];
    newGifs.splice(index, 1);
    setComment({ ...comment, attachedGifs: newGifs });
  };

  useEffect(() => {
    getSubSystem(
      (subSystem) => {
        setTenorApiKey(subSystem.tenorAPIKey);
      },
      (error) => {
        console.error("getSubSystem error", error);
        showSnackbar("Gif selector is not available.", "warning");
      }
    );
  }, []);

  const handleAddComment = (comment) => {
    if (product) {
      addProductComment(
        product,
        comment,
        (rComment) => {
          console.log("Comment added successfully", rComment);
          showSnackbar("Comment added successfully", "success");
          setComment(getNewComment());
        },
        (error) => {
          showSnackbar("Failed to add comment", "error");
          console.error("addProductComment error", error);
        },
        dispatch
      );
    } else if (parentComment) {
      addReplyToComment(
        parentComment,
        comment,
        (rComment) => {
          console.log("Comment added successfully", rComment);
          showSnackbar("Comment added successfully", "success");
          setComment(getNewComment());
          if (onReplyAdded) {
            onReplyAdded(rComment);
          }
        },
        (error) => {
          showSnackbar("Failed to add comment", "error");
          console.error("addProductComment error", error);
        }
      );
    } else {
      showSnackbar("Product or parent comment not found", "error");
    }
  };

  return (
    <ThemeProvider theme={violet_theme}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          border: "1px solid lightgray",
          borderRadius: "5px",
          backgroundColor: "white",
        }}
      >
        <TextField
          id="comment"
          placeholder="Comment..."
          multiline
          fullWidth
          variant="standard"
          value={comment.content}
          onChange={(e) => {
            setComment({ ...comment, content: e.target.value });
          }}
          InputProps={{
            disableUnderline: true,
          }}
          sx={{
            marginLeft: "10px",
          }}
        />
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
                <IconButton
                  onClick={() => {
                    const newImages = [...comment.attachedImages];
                    newImages.splice(index, 1);
                    setComment({ ...comment, attachedImages: newImages });
                  }}
                  sx={{
                    position: "absolute",
                    top: "0",
                    right: "0",
                    color: "white",
                  }}
                  color="secondary"
                >
                  <CancelIcon
                    color="primary"
                    sx={{
                      backgroundColor: "white",
                      borderRadius: "50%",
                    }}
                  />
                </IconButton>
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
                <IconButton
                  onClick={() => {
                    removeGif(index);
                  }}
                  sx={{
                    position: "absolute",
                    top: "0",
                    right: "0",
                    color: "white",
                  }}
                  color="secondary"
                >
                  <CancelIcon
                    color="primary"
                    sx={{
                      backgroundColor: "white",
                      borderRadius: "50%",
                    }}
                  />
                </IconButton>
              </Box>
            ))}
          </Box>
        </Box>

        <Popover
          open={popupState !== POPUP_STATE.CLOSE}
          anchorEl={anchorEl}
          onClose={handleCloseSelector}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "center",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "center",
          }}
        >
          {popupState === POPUP_STATE.EMOJI && (
            <Picker onEmojiClick={onEmojiClick} />
          )}
          {popupState === POPUP_STATE.GIF && tenorApiKey && (
            <GifPicker tenorApiKey={tenorApiKey} onGifClick={onGifClick} />
          )}
          {popupState === POPUP_STATE.IMAGE && (
            <TextField
              label="Image URL"
              onChange={(e) => {
                setInputUrl(e.target.value);
              }}
              value={inputUrl}
              type="url"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => {
                        if (inputUrl === "") return;
                        setComment({
                          ...comment,
                          attachedImages: [...comment.attachedImages, inputUrl],
                        });
                        handleCloseSelector();
                        setInputUrl("");
                      }}
                    >
                      <AddCircleOutlineIcon color="primary" />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          )}
        </Popover>

        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-around",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              alignItems: "start",
              justifyContent: "start",
              width: "100%",
            }}
          >
            <IconButton
              onClick={(event) => {
                handleOpenSelector(event, POPUP_STATE.EMOJI);
              }}
            >
              <EmojiEmotionsIcon />
            </IconButton>
            <IconButton
              onClick={(event) => {
                handleOpenSelector(event, POPUP_STATE.GIF);
              }}
            >
              <GifBoxIcon />
            </IconButton>
            <IconButton
              onClick={(event) => {
                handleOpenSelector(event, POPUP_STATE.IMAGE);
              }}
            >
              <AddPhotoAlternateIcon />
            </IconButton>
          </Box>
          <IconButton
            onClick={() => {
              handleCloseSelector();
              handleAddComment(comment);
            }}
          >
            <Send />
          </IconButton>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

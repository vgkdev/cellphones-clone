import React, { useEffect, useState } from "react";
import { EditorState, convertToRaw, ContentState } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import draftToHtml from "draftjs-to-html";
import {
  Box,
  Button,
  Checkbox,
  Dialog,
  FormControlLabel,
  Grid,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import {
  AddCircleOutlined,
  CheckBox,
  Clear,
  Done,
  EditOffOutlined,
  EditOutlined,
  PreviewOutlined,
  SaveOutlined,
} from "@mui/icons-material";
import { set } from "firebase/database";
import { syncUploadPostImage } from "../../../db/storageImage";
import { Post } from "../../../models/Post";
import { useAddPost, useUpdatePost } from "../../../db/dbPost";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { PostCategory } from "../../../models/Post";
import { useSnackbarUtils } from "../../../utils/useSnackbarUtils";
import { useSelector } from "react-redux";
import { Form } from "react-router-dom";

export default function PostForm({ formCreatedCallback = null }) {
  const [post, setPost] = useState(new Post().data());
  const [contentState, setContentState] = useState(
    ContentState.createFromText(post.content)
  );
  const [editorState, setEditorState] = useState(
    EditorState.createWithContent(contentState)
  );
  const [openPreviewDialog, setOpenPreviewDialog] = useState(false);
  const [openEditContentDialog, setOpenEditContentDialog] = useState(false);
  const [autoSave, setAutoSave] = useState(true);
  const [autoReset, setAutoReset] = useState(false);

  const user = useSelector((state) => state.user.user);

  // utils
  const { showSnackbar } = useSnackbarUtils();

  const onEditorStateChange = (editorState) => {
    setEditorState(editorState);
  };

  const uploadImageCallBack = async (file) => {
    if (post.id === "") return Promise.reject("Post not created yet");
    // Implement your image upload functionality here
    try {
      const url = await syncUploadPostImage(post, file);
      showSnackbar("Image uploaded: " + file.name, "success");
      return Promise.resolve({ data: { link: url } });
    } catch (error) {
      console.error(error);
      showSnackbar("Error uploading image: " + error, "error");
      return Promise.reject(error);
    }
  };

  const addPost = useAddPost();

  const handleCreateNewPost = (e) => {
    post.author = user?.id;
    post.publishedAt = Date.now();
    post.lastUpdate = Date.now();
    addPost(
      post,
      (returnPost) => {
        console.log("Post created: ", returnPost);
        showSnackbar("Post created", "success");
        setPost({
          ...post,
          id: returnPost.id,
          lastUpdate: returnPost.lastUpdate,
        });
        setOpenEditContentDialog(true);
      },
      (error) => {
        showSnackbar("Error creating post", "error");
        console.error("Error creating post: ", error);
      }
    );
  };

  const updatePostFirebaseAndRedux = useUpdatePost();

  const handleSavePost = (e) => {
    if (post.id === "") {
      return;
    }
    const newPost ={...post};
    newPost.content = draftToHtml(convertToRaw(editorState.getCurrentContent()));
    updatePostFirebaseAndRedux(
      newPost,
      () => {
        showSnackbar("Post saved", "success");
        console.log("Post saved: ", newPost);
        setPost(newPost);
      },
      (error) => {
        showSnackbar("Error saving post: " + error, "error");
        console.error("Error saving post: ", error);
      }
    );
  };

  const handlePreview = (e) => {
    setOpenPreviewDialog(true);
  };

  const handleClosePreviewDialog = () => {
    setOpenPreviewDialog(false);
  };

  const resetForm = () => {
    setPost(new Post().data());
    setContentState(ContentState.createFromText(""));
    setEditorState(EditorState.createWithContent(contentState));
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Typography variant="h6" color="primary">
        Title
      </Typography>
      <TextField
        fullWidth
        name="title"
        value={post.title}
        onChange={(e) => {
          setPost({ ...post, title: e.target.value });
        }}
      />
      <Typography variant="h6" color="primary">
        Description
      </Typography>
      <TextField
        fullWidth
        multiline
        rows={4}
        name="description"
        value={post.description}
        onChange={(e) => {
          setPost({ ...post, description: e.target.value });
        }}
      />
      <Typography variant="h6" color="primary">
        Category
      </Typography>
      <Select
        fullWidth
        value={post.category}
        onChange={(e) => {
          setPost({ ...post, category: e.target.value });
        }}
      >
        {Object.values(PostCategory).map((value) => {
          return (
            <MenuItem key={value} value={value}>
              {value}
            </MenuItem>
          );
        })}
      </Select>

      {post.id !== "" ? (
        <Box>
          <Typography variant="h6" color="primary">
            Content
          </Typography>

          <Dialog
            open={openEditContentDialog}
            onClose={() => {
              setOpenEditContentDialog(false);
              if (autoSave) {
                handleSavePost();
              }
            }}
            maxWidth="lg"
          >
            <Box
              width={"100%"}
              height={"100%"}
              sx={{
                ".rdw-editor-toolbar": {
                  position: "sticky",
                  top: 0,
                  zIndex: 1000,
                  backgroundColor: "#ffff", // To prevent text underneath from showing through
                  background: "white",
                },
                height: window.screen.height * 0.5,
              }}
            >
              <Editor
                editorState={editorState}
                onEditorStateChange={onEditorStateChange}
                toolbar={{
                  image: {
                    uploadCallback: uploadImageCallBack,
                    alt: { present: true, mandatory: true },
                    previewImage: true,
                  },
                }}
              />
            </Box>
          </Dialog>
          <Typography variant="h6" color="primary">
            HTML Output
          </Typography>
          <TextField
            disabled
            value={draftToHtml(convertToRaw(editorState.getCurrentContent()))}
            fullWidth
            multiline
            rows={5}
          />
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "flex-end",
              gap: "10px",
              padding: "10px",
            }}
          >
            <FormControlLabel
              control={
                <Checkbox
                  color="primary"
                  checked={autoSave}
                  onChange={(e) => {
                    setAutoSave(e.target.checked);
                  }}
                />
              }
              label="Auto save"
              key="btn-auto-save"
            />
            <Button
              variant="outlined"
              startIcon={<EditOutlined />}
              onClick={(e) => {
                setOpenEditContentDialog(true);
              }}
            >
              Edit Content
            </Button>
            <Button
              variant="outlined"
              startIcon={<PreviewOutlined />}
              onClick={(e) => {
                handlePreview(e);
              }}
            >
              Preview
            </Button>
            <Button
              variant="outlined"
              startIcon={<SaveOutlined />}
              onClick={(e) => {
                handleSavePost(e);
              }}
            >
              Save
            </Button>
            <Button
              variant="contained"
              color="primary"
              startIcon={<Done />}
              onClick={(e) => {
                if (formCreatedCallback) {
                  handleSavePost(e);
                  formCreatedCallback(post);
                }
              }}
            >
              Finish
            </Button>
          </Box>

          {/* Preview dialog */}
          <Dialog
            open={openPreviewDialog}
            onClose={() => {
              handleClosePreviewDialog();
            }}
          >
            <Grid container>
              <Grid item xs={12}>
                <Typography variant="h6" color="primary">
                  {post.title}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body1">{post.description}</Typography>
              </Grid>
              <Grid item xs={12}>
                <div
                  dangerouslySetInnerHTML={{
                    __html: draftToHtml(
                      convertToRaw(editorState.getCurrentContent())
                    ),
                  }}
                ></div>
              </Grid>
            </Grid>
          </Dialog>
        </Box>
      ) : (
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "flex-end",
            gap: "10px",
            padding: "10px",
          }}
        >
          <Button
            variant="contained"
            color="primary"
            onClick={(e) => handleCreateNewPost(e)}
          >
            Create
          </Button>
        </Box>
      )}
      <FormControlLabel
        control={
          <Checkbox
            color="primary"
            checked={autoReset}
            onChange={(e) => {
              setAutoReset(e.target.checked);
            }}
          />
        }
        label="Auto reset"
        key="btn-auto-reset"
      />
      <Button
        startIcon={<Clear />}
        variant="outlined"
        onClick={(e) => {
          resetForm();
        }}
      >
        Reset
      </Button>
    </Box>
  );
}

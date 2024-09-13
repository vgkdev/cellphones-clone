import * as React from "react";
import { violet_theme } from "../../theme/AppThemes";
import { ThemeProvider } from "@mui/material/styles";
import { Box, Divider, Grid, Typography } from "@mui/material";
import { useSnackbarUtils } from "../../utils/useSnackbarUtils";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { SentimentDissatisfied } from "@mui/icons-material";
import SimpleLoadingDisplay from "../../components/miscellaneous/SimpleLoadingDisplay";
import { getUserById } from "../../db/dbUser";
import { useDispatch, useSelector } from "react-redux";
import { reduxGetAllPosts } from "../../store/actions/postsAction";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default function ViewPostPage() {
  let query = useQuery();
  const postId = query.get("post");
  const { showSnackbar } = useSnackbarUtils();
  const [post, setPost] = React.useState(null);
  const [author, setAuthor] = React.useState(null);
  const { posts, loading, error } = useSelector((state) => state.posts);

  const dispatch = useDispatch();

  useEffect(() => {
    if (posts.length === 0) {
      dispatch(reduxGetAllPosts());
    }
  }, [posts.length]);

  useEffect(() => {
    if (posts.length === 0) {
      return;
    }
    const post = posts.find((post) => post.id === postId);
    setPost(post);
  }, [posts]);

  useEffect(() => {
    if (!post || post.author === "") {
      return;
    }

    if(posts.length !==0){
      return;
    }

    getUserById(
      post.author,
      (author) => {
        setAuthor(author);
      },
      (error) => {
        showSnackbar(error, "warning", true);
      }
    );
  }, [post, posts]);

  if (!post) {
    return (
      <>
        <SimpleLoadingDisplay />
      </>
    );
  }

  return (
    <ThemeProvider theme={violet_theme}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "start",
          alignItems: "start",
          flexDirection: "row",
        }}
        width="100%"
      >
        {/* right 70% */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "start",
            alignItems: "center",
            flexDirection: "column",
            p: 3,
            width: "70%",
          }}
        >
          <Typography
            variant="h4"
            sx={{
              textAlign: "center",
              color: violet_theme.palette.primary.main,
              fontWeight: "bold",
            }}
          >
            {post.title}
          </Typography>

          <Typography
            variant="p"
            sx={{
              textAlign: "start",
              color: violet_theme.palette.primary.main,
              fontWeight: "bold",
            }}
          >
            {author ? author.lastName + " " + author.firstName : "Unknown"}
          </Typography>

          <Typography variant="body1" fontSize={12}>
            {"Published at " + new Date(post.publishedAt).toLocaleString()}
          </Typography>

          <Typography variant="body1" fontSize={12}>
            {"Last update " + new Date(post.lastUpdate).toLocaleString()}
          </Typography>

          <Typography
            variant="body1"
            marginTop={2}
            marginBottom={2}
            fontWeight="bold"
            fontSize={16}
            color="primary.main"
          >
            {post.description}
          </Typography>

          <Typography
            variant="body1"
            fontSize={14}
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </Box>

        {/* left 30% */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            p: 3,
            width: "30%",
            position: "sticky",
            top: 0,
            overflowY: "auto",
            height: "70vh",
            paddingTop: "10vh",
          }}
        >
          {posts?.length > 0 ? (
            posts.map((post) => (
              <Box
                key={post.id}
                sx={{
                  p: 2,
                  mt: 2,
                  borderRadius: 1,
                }}
              >
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Typography
                      component="a"
                      variant="h6"
                      color="primary"
                      href={`/shopping/view-post?post=${post.id}`}
                      onClick={() => {
                        console.log("Link clicked!");
                      }}
                      sx={{
                        textDecoration: "none",
                        "&:hover": {
                          textDecoration: "underline",
                        },
                      }}
                    >
                      {post.title}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="body1">{post.description}</Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="caption">
                      {new Date(post.lastUpdate).toLocaleString()}
                    </Typography>
                  </Grid>
                </Grid>
                <Divider />
              </Box>
            ))
          ) : (
            <Typography variant="body1" align="center">
              No posts available
            </Typography>
          )}
        </Box>
      </Box>
    </ThemeProvider>
  );
}

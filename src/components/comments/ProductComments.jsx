import { ThemeProvider } from "@emotion/react";
import { violet_theme } from "../../theme/AppThemes";
import { Box } from "@mui/material";
import { useSelector } from "react-redux";
import { useState } from "react";
import { useEffect } from "react";
import { getAllProductComments } from "../../db/dbComment";
import { useSnackbarUtils } from "../../utils/useSnackbarUtils";
import NewComment from "./NewComment";
import CommentsDisplay from "./CommentDisplay";

export default function ProductComments({ product }) {
  const user = useSelector((state) => state.user.user);
  const [replyingTo, setReplyingTo] = useState("");
  const { showSnackbar } = useSnackbarUtils();

  return (
    <ThemeProvider theme={violet_theme}>
      <NewComment product={product} userId={user ? user.id : ""} />
      {product.comments.map((commentId) => (
        <CommentsDisplay
          commentId={commentId}
          userId={user ? user.id : ""}
          product={product}
          parentComment={null}
          key={commentId}
          replyingTo={replyingTo}
          setReplyingTo={setReplyingTo}
        />
      ))}
    </ThemeProvider>
  );
}

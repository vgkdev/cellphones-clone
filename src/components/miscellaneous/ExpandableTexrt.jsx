import { Button, Typography } from "@mui/material";
import React, { useState } from "react";

export default function ExpandableText({ text, maxLength }) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (text.length <= maxLength) {
    return (
      <Typography
        variant="body1"
        sx={{
          whiteSpace: "pre-wrap",
          overflowWrap: "break-word",
          color: "inherit",
        }}
      >
        {text}
      </Typography>
    );
  }

  return (
    <Typography
      variant="body1"
      sx={{
        whiteSpace: "pre-wrap",
        overflowWrap: "break-word",
        color: "inherit",
      }}
    >
      {isExpanded ? text : `${text.slice(0, maxLength)}...`}
      <Typography
        variant="text"
        color="black"
        onClick={() => setIsExpanded(!isExpanded)}
        sx={{
          cursor: "pointer",
          color: "blue",
        }}
      >
        {isExpanded ? "Show less" : "Show more"}
      </Typography>
    </Typography>
  );
}

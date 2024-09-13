import React from "react";
import { Pagination } from "@mui/material";

const PaginationComponent = ({ page, count, onChange }) => {
  return (
    <Pagination
      page={page}
      count={count}
      onChange={onChange}
      color="primary"
      sx={{ marginTop: 2, justifyContent: "center", display: "flex" }}
    />
  );
};

export default PaginationComponent;

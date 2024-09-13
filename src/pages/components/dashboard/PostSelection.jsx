import * as React from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { useState } from "react";
import { useEffect } from "react";
import { Box, Chip, Grid, Tooltip, Typography, styled } from "@mui/material";
import { SentimentDissatisfiedOutlined } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { reduxGetAllPosts } from "../../../store/actions/postsAction";

const GroupHeader = styled("div")(({ theme }) => ({
  position: "sticky",
  top: "-8px",
  padding: "4px 10px",
  color: theme.palette.primary.main,
}));

const GroupItems = styled("ul")({
  padding: 0,
});

export default function PostSelection({ selectedPostIds, setSelectedPostIds }) {
  const [options, setOptions] = useState([]);
  const [selectedValues, setSelectedValues] = useState([]);
  const {posts, loading, error} = useSelector((state) => state.posts);
  const dispatch = useDispatch();

  useEffect(() => {
    if(posts.length === 0) {
      dispatch(reduxGetAllPosts())
    }
  }, [posts.length]);

  useEffect(() => {
    if (options.length === 0) return;
    setSelectedValues(
      selectedPostIds.map((id) => {
        return options.find((option) => option.id === id);
      })
    );
  }, [options, selectedPostIds]);

  useEffect(() => {
    if(posts.length === 0) {
      return;
    }

    setOptions([...posts]);
  }, [posts]);

  console.log("selectedPosts: ", selectedPostIds);
  console.log("selectedValues: ", selectedValues);

  return options.length === 0 ? (
    <Grid
      container
      direction="row"
      justifyContent="center"
      alignItems="center"
      spacing={2}
    >
      <Grid item>
        <SentimentDissatisfiedOutlined fontSize="large" />
      </Grid>
      <Grid item>
        <Typography variant="h6">
          No posts found. Please create a post first.
        </Typography>
      </Grid>
    </Grid>
  ) : (
    <Autocomplete
      multiple
      options={options.sort((a, b) => -b.category.localeCompare(a.category))}
      groupBy={(option) => option.category}
      getOptionLabel={(option) => option.title}
      renderInput={(params) => <TextField {...params} label="Posts" />}
      value={selectedValues}
      isOptionEqualToValue={(option, value) => option.id === value.id}
      onChange={(event, newValue) => {
        const newIds = newValue.map((value) => value.id);
        setSelectedPostIds(newIds);
        setSelectedValues(newValue);
      }}
      renderGroup={(params) => [
        <li key={params.key}>
          <GroupHeader>{params.group}</GroupHeader>
          <GroupItems>{params.children}</GroupItems>
        </li>,
      ]}
      renderOption={(props, option, { selected }) => (
        <Box
          component="li"
          sx={{ "& > :not(style)": { ...props.sx, py: 2, px: 1 } }}
          {...props}
          key={option.id+"-box"}
        >
          <Tooltip
            title={
              <Box>
                <Typography variant="h6" component="h6">
                  {option.title}
                </Typography>
                <Typography variant="body1" component="p">
                  {option.description}
                </Typography>
              </Box>
            }
            placement="right"
            key={option.id+"-tooltip1"}
          >
            <Chip label={option.title} selected={selected} />
          </Tooltip>
        </Box>
      )}
      renderTags={(value, getTagProps) =>
        value.map((option, index) => (
          <Tooltip
            title={
              <Box>
                <Typography variant="h6" component="h6">
                  {option.title}
                </Typography>
                <Typography variant="body1" component="p">
                  {option.description}
                </Typography>
              </Box>
            }
            key={index+"-tooltip2-"+option.id}
          >
            <Chip label={option.title} {...getTagProps({ index })} />
          </Tooltip>
        ))
      }
      fullWidth
      style={{ width: "100%" }}
    />
  );
}

import * as React from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { styled } from "@mui/system";
import { useState } from "react";
import { useEffect } from "react";
import { Box, Chip, Grid, Tooltip, Typography } from "@mui/material";
import { SentimentDissatisfiedOutlined } from "@mui/icons-material";
import { getAllFAQs } from "../../../db/dbFAQ";

const GroupHeader = styled("div")(({ theme }) => ({
  position: "sticky",
  top: "-8px",
  padding: "4px 10px",
  color: theme.palette.primary.main,
}));

const GroupItems = styled("ul")({
  padding: 0,
});

export default function FAQsSelection({ selectedFAQIds, setSelectedFAQIds }) {
  const [options, setOptions] = useState([]);
  const [selectedValues, setSelectedValues] = useState([]);

  useEffect(() => {
    getAllFAQs(
      (faqs) => {
        console.log("faqs: ", faqs);
        setOptions(faqs);
      },
      (error) => {
        console.error("Error getting FAQs: ", error);
      }
    );
  }, []);

  useEffect(() => {
    if (options.length === 0) return;
    setSelectedValues(
      selectedFAQIds.map((id) => {
        return options.find((option) => option.id === id);
      })
    );
  }, [options, selectedFAQIds]);

  console.log("selectedFAQs: ", selectedFAQIds);
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
        <Typography variant="h6">No FAQs found</Typography>
      </Grid>
    </Grid>
  ) : (
    <Autocomplete
      id="faq-selection"
      multiple
      options={options.sort((a, b) => -b.category.localeCompare(a.category))}
      groupBy={(option) => option.category}
      getOptionLabel={(option) => option.question}
      renderInput={(params) => <TextField {...params} label="FAQs" />}
      value={selectedValues}
      isOptionEqualToValue={(option, value) => option.id === value.id}
      onChange={(event, newValue) => {
        setSelectedValues(newValue);
        setSelectedFAQIds(newValue.map((value) => value.id));
      }}
      renderGroup={(params) => [
        <li key={params.key}>
          <GroupHeader>{params.group}</GroupHeader>
          <GroupItems>{params.children}</GroupItems>
        </li>,
      ]}
      renderOption={(props, option, { selected }) => {
        return (
          <Box
            component="li"
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              ...(selected && {
                backgroundColor: "transparent",
              }),
            }}
            {...props}
            key={option.id+"-faq-selection"}
          >
            <Tooltip
              title={
                <Box>
                  <Typography variant="h6">{option.title}</Typography>
                  <Typography variant="body1">{option.question}</Typography>
                </Box>
              }
              placement="right"
            >
              <Chip label={option.question} selected={selected} />
            </Tooltip>
          </Box>
        );
      }}
      renderTags={(value, getTagProps) =>
        value.map((option, index) => (
          <Tooltip
            title={
              <Box>
                <Typography variant="h6">{option.title}</Typography>
                <Typography variant="body1">{option.question}</Typography>
              </Box>
            }
            key={option.id+"-tooltip-faq"}
          >
            <Chip label={option.title} {...getTagProps({ index })} />
          </Tooltip>
        ))
      }
    />
  );
}

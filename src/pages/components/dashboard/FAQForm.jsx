import React, { useEffect, useState } from "react";

import {
  Box,
  Button,
  Dialog,
  Grid,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
} from "@mui/material";

import { FAQCategory } from "../../../models/FAQ";
import { useSnackbarUtils } from "../../../utils/useSnackbarUtils";
import { FAQ } from "../../../models/FAQ";
import { addNewFAQ, updateFAQ } from "../../../db/dbFAQ";

export default function FAQForm({FAQCreatedCallback=null}) {
  const [faq, setFAQ] = useState(new FAQ().data());
  const [openPreviewDialog, setOpenPreviewDialog] = useState(false);
  const { showSnackbar } = useSnackbarUtils();

  const handleCreateNewFAQ = (e) => {
    addNewFAQ(
      faq,
      (returnFAQ) => {
        console.log("FAQ created: ", returnFAQ);
        showSnackbar("FAQ created", "success");
        setFAQ({
          ...faq,
          id: returnFAQ.id,
        });
        if (FAQCreatedCallback) {
          FAQCreatedCallback(returnFAQ);
        }
      },
      (error) => {
        console.error(error);
        showSnackbar("Error creating FAQ: " + error, "error");
      }
    );
  };

  const handleUpdateFAQ = (e) => {
    updateFAQ(
      faq,
      (returnFAQ) => {
        console.log("FAQ updated: ", returnFAQ);
        showSnackbar("FAQ updated", "success");
        setFAQ({
          ...faq,
          id: returnFAQ.id,
        });
      },
      (error) => {
        console.error(error);
        showSnackbar("Error updating FAQ: " + error, "error");
      }
    );
  };

  console.log("FAQForm", faq);

  return (
    <Box>
      <Grid container spacing={2}>
      <Grid item xs={12}>
            <Typography variant="h6" color="primary">
            Title
            </Typography>
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Title"
            fullWidth
            value={faq.title}
            onChange={(e) => setFAQ({ ...faq, title: e.target.value })}
          />
        </Grid>
        <Grid item xs={12}>
            <Typography variant="h6" color="primary">
                Category
            </Typography>
        </Grid>
        <Grid item xs={12}>
          <Select
            fullWidth
            value={faq.category}
            onChange={(e) => setFAQ({ ...faq, category: e.target.value })}
          >
            {Object.values(FAQCategory).map((value) => {
              return (
                <MenuItem key={value} value={value}>
                  {value}
                </MenuItem>
              );
            })}
          </Select>
        </Grid>
        <Grid item xs={12}>
            <Typography variant="h6" color="primary">
                Question
            </Typography>
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Question"
            fullWidth
            value={faq.question}
            onChange={(e) => setFAQ({ ...faq, question: e.target.value })}
          />
        </Grid>
        <Grid item xs={12}>
            <Typography variant="h6" color="primary">
                Answer
            </Typography>
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Answer"
            fullWidth
            multiline
            rows={4}
            value={faq.answer}
            onChange={(e) => setFAQ({ ...faq, answer: e.target.value })}
          />
        </Grid>
      </Grid>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "flex-end",
          gap: "10px",
          padding: "10px",
        }}
      >
        {faq.id === "" ? (
          <Button
            variant="contained"
            color="primary"
            onClick={handleCreateNewFAQ}
          >
            Create
          </Button>
        ) : (
          <Button variant="outlined" color="primary" onClick={handleUpdateFAQ}>
            Update
          </Button>
        )}
      </Box>
    </Box>
  );
}

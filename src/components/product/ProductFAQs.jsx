import { ThemeProvider } from "@emotion/react";
import * as React from "react";

import { violet_theme } from "../../theme/AppThemes";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { useEffect } from "react";
import { getProductFAQs, getProductFAQsByProduct } from "../../db/dbFAQ";
import SimpleLoadingDisplay from "../miscellaneous/SimpleLoadingDisplay";
import { ExpandMore } from "@mui/icons-material";

export default function ProductFAQs({ product }) {
  const [faqs, setFaqs] = useState(null);

  useEffect(() => {
    getProductFAQsByProduct(
      product,
      (faqs) => {
        setFaqs(faqs);
      },
      (error) => {
        console.error("Error getting FAQs: ", error);
      }
    );
  }, [product]);

  if (!faqs) {
    return <SimpleLoadingDisplay />;
  }

  // console.log("checking faqs", faqs);

  return (
    <>
      <ThemeProvider theme={violet_theme}>
        <Box
          sx={(theme) => ({
            bgcolor: theme.palette.whiteGray,
            color: "text.primary",
            p: 3,
            borderRadius: 1,
          })}
          justifyContent="center"
          alignItems="center"
        >
          <Typography variant="h6" sx={{ textAlign: "center" }} color="primary">
            Frequently Asked Questions
          </Typography>

          {faqs.map((faq) => (
            <Accordion key={faq.id}>
              <AccordionSummary
                expandIcon={<ExpandMore />}
                aria-controls="panel1-content"
                id="panel1-header"
              >
                <Typography>{faq.question}</Typography>
              </AccordionSummary>
              <AccordionDetails
                sx={(theme) => ({
                  bgcolor: theme.palette.slightlyDarkerWhiteGray,
                })}
              >
                <Typography>{faq.answer}</Typography>
              </AccordionDetails>
            </Accordion>
          ))}
        </Box>
      </ThemeProvider>
    </>
  );
}

import * as React from "react";

import { Box, Button, Grid, ThemeProvider, Typography } from "@mui/material";
import { violet_theme } from "../../theme/AppThemes";
import { useState } from "react";
import { useEffect } from "react";
import { getAllProducers } from "../../db/dbProducer";
import { useSnackbarUtils } from "../../utils/useSnackbarUtils";
import ProducerCard from "./ProducerCard";

export default function ProducersShowcase() {
  const [producers, setProducers] = useState([]);
  const { showSnackbar } = useSnackbarUtils();

  useEffect(() => {
    getAllProducers(
      (producers) => {
        setProducers(producers);
      },
      (error) => showSnackbar("Error fetching producers", "error", true)
    );
  }, []);

  return (
    <ThemeProvider theme={violet_theme}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "start",
          justifyContent: "start",
          flexWrap: "wrap",
          gap: "20px",
          marginTop: 2,
          marginBottom: 2,
        }}
      >
        {producers.map((producer) => (
          <ProducerCard key={producer.id} producer={producer} />
        ))}
      </Box>
    </ThemeProvider>
  );
}

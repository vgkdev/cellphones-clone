import * as React from "react";

import { Box, Button, Grid, ThemeProvider, Typography } from "@mui/material";
import { violet_theme } from "../../theme/AppThemes";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";
import { useDispatch, useSelector } from "react-redux";
import SimpleLoadingDisplay from "../miscellaneous/SimpleLoadingDisplay";
import { useEffect } from "react";
import { getAllProducts } from "../../store/actions/productsAction";
import { hashNameToRgba } from "../../utils/stringHelper";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function ProductsByProducerPieChart({ producerList }) {
  const { products, loading, error } = useSelector((state) => state.products);
  const dispatch = useDispatch();

  const getProductCountByProducer = (producerName) => {
    const res =  products.filter((product) => product.manufacturer === producerName).length;
    // console.log("getProductCountByProducer", res);
    return res;
  };

  const getDataForChart = () => {
    const data = {
      labels: producerList.map((producer) => producer.name),
      datasets: [
        {
          label: "Products: ",
          data: producerList.map((producer) =>
            getProductCountByProducer(producer.name)
          ),
          backgroundColor: producerList.map((producer) =>
            hashNameToRgba(producer.name)
          ),
          borderColor: producerList.map((producer) =>
            hashNameToRgba(producer.name)
          ),
          borderWidth: 1,
        },
      ],
    };
    return data;
  };

  useEffect(() => {
    if (products.length === 0) {
      dispatch(getAllProducts());
    }
  }, [products.length]);

  if (!products) {
    return <SimpleLoadingDisplay />;
  }

  return (
    <ThemeProvider theme={violet_theme}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          maxHeight: 300,
          maxWidth: 300,
          margin: 2,
        }}
      >
        <Typography variant="p" color="primary">
          By Producer
        </Typography>

        <Pie data={getDataForChart()} />
      </Box>
    </ThemeProvider>
  );
}

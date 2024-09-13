import * as React from "react";

import {
  Box,
  Button,
  Chip,
  FormLabel,
  Grid,
  IconButton,
  LinearProgress,
  MenuItem,
  Select,
  Tab,
  Tabs,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { useState, useEffect } from "react";

import {
  DeleteOutline,
  PlaylistAdd,
  Refresh,
  SaveOutlined,
  SentimentDissatisfied,
  SentimentDissatisfiedOutlined,
  Topic,
} from "@mui/icons-material";

import { ThemeProvider } from "@mui/material";
import SwipeableViews from "react-swipeable-views";
import { violet_theme } from "../../../theme/AppThemes";
import { useTheme } from "@mui/material/styles";
import { getProductById, updateProduct } from "../../../db/dbProduct";
import { useSnackbarUtils } from "../../../utils/useSnackbarUtils";
import { set } from "firebase/database";
import FAQsSelection from "./FAQSelection";
import FAQForm from "./FAQForm";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

export default function ManageFAQ({ productId }) {
  const [product, setProduct] = useState(null);
  const setSelectedFAQIds = (faqs) => {
    setProduct({ ...product, FAQs: faqs });
  };
  const [tabValue, setTabValue] = useState(0);

  const theme = useTheme();

  // utils
  const { showSnackbar } = useSnackbarUtils();

  // handlers

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleTabChangeIndex = (index) => {
    setTabValue(index);
  };

  const handleSave = () => {
    updateProduct(
      product,
      product.id,
      (updatedProduct) => {
        console.log("Product updated: ", updatedProduct);
        showSnackbar("Product updated", "success");
        setProduct({
          ...updatedProduct,
        });
      },
      (error) => {
        console.error("Error updating product: ", error);
        showSnackbar("Error updating product: " + error, "error");
      }
    );
  };

  const [hasErrorWhenFetchingProduct, setHasErrorWhenFetchingProduct] =
    useState(false);

  useEffect(() => {
    getProductById(
      productId,
      (product) => {
        console.log("Product: ", product);
        setProduct(product);
      },
      (error) => {
        console.error("Error getting product: ", error);
        if (hasErrorWhenFetchingProduct === false) {
          setHasErrorWhenFetchingProduct(true);
        }
      }
    );
  }, [productId, hasErrorWhenFetchingProduct]);

  if (product === null) {
    // spinner
    return (
      <>
        {hasErrorWhenFetchingProduct ? (
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
          >
            <SentimentDissatisfiedOutlined />
            <p>Error fetching product</p>
            <Button
              onClick={(e) => {
                setHasErrorWhenFetchingProduct(false);
                getProductById(
                  productId,
                  (product) => {
                    console.log("Product: ", product);
                    setProduct(product);
                  },
                  (error) => {
                    console.error("Error getting product: ", error);
                    if (hasErrorWhenFetchingProduct === false) {
                      setHasErrorWhenFetchingProduct(true);
                    }
                  }
                );
              }}
              variant="outlined"
              startIcon={<Refresh />}
            >
              Retry
            </Button>
          </Box>
        ) : (
          <Grid>
            <p>Loading ...</p>
            <Box sx={{ width: "100%" }}>
              <LinearProgress />
            </Box>
          </Grid>
        )}
      </>
    );
  }

  return (
    <ThemeProvider theme={violet_theme}>
      <Box
        sx={{
          overflowY: "auto",
          display: "flex",
          flexGrow: 1,
          flexDirection: "column",
          gap: "10px",
        }}
      >
        <Typography variant="h6" component="h6">
          FAQ
        </Typography>
        <Grid container spacing={2} justifyContent="center">
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            aria-label="icon label tabs example"
          >
            <Tab icon={<Topic />} label="Select" />
            <Tab icon={<PlaylistAdd />} label="New" />
          </Tabs>
        </Grid>
        <SwipeableViews
          axis={theme.direction === "rtl" ? "x-reverse" : "x"}
          index={tabValue}
          onChangeIndex={handleTabChangeIndex}
        >
          <TabPanel value={tabValue} index={0} dir={theme.direction}>
            <FAQsSelection
              selectedFAQIds={product.FAQs}
              setSelectedFAQIds={setSelectedFAQIds}
            />
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "flex-end",
                gap: "10px",
                padding: "10px",
              }}
            >
              <Button
                variant="outlined"
                startIcon={<SaveOutlined />}
                onClick={(e) => {
                  handleSave(e);
                }}
              >
                Save
              </Button>
            </Box>
          </TabPanel>
          <TabPanel value={tabValue} index={1} dir={theme.direction}>
            <FAQForm
              FAQCreatedCallback={(createdFAQ) => {
                console.log("FAQ created: ", createdFAQ);
                setProduct({
                  ...product,
                  FAQs: [...product.FAQs, createdFAQ.id],
                });
                handleTabChangeIndex(0);
                updateProduct(
                  { ...product, FAQs: [...product.FAQs, createdFAQ.id] },
                  product.id,
                  (updatedProduct) => {
                    console.log("Product updated: ", updatedProduct);
                    showSnackbar("FAQ created", "success");
                  },
                  (error) => {
                    console.error(error);
                    showSnackbar("Error creating FAQ: " + error, "error");
                  }
                );
              }}
            />
          </TabPanel>
        </SwipeableViews>
      </Box>
    </ThemeProvider>
  );
}

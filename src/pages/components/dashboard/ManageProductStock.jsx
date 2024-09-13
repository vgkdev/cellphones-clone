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
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { useState, useEffect } from "react";
import {
  addProductStock,
  addStockImage,
  deleteProductStock,
  deleteStockImage,
  getAllProductStocks,
  saveProductStock,
  updateProductStock,
} from "../../../db/dbStock";
import {
  DeleteOutline,
  Refresh,
  SaveOutlined,
  SentimentDissatisfiedOutlined,
} from "@mui/icons-material";
import { toSimpleDateString } from "../../../utils/date";
import PlusIcon from "@mui/icons-material/Add";
import { Stock } from "../../../models/Stock";
import { useSnackbarUtils } from "../../../utils/useSnackbarUtils";
import { getProductById } from "../../../db/dbProduct";

const priceFormatter = new Intl.NumberFormat("vi-VN", {
  style: "currency",
  currency: "VND",
});

export default function ManageProductStock({ productId, onFinished = null }) {
  // states
  const [product, setProduct] = useState(null);
  const [listStock, setListStock] = useState(null);

  //utils
  const { showSnackbar } = useSnackbarUtils();

  // handlers
  const handleUploadImage = (color, stockIndex) => {
    // open file dialog
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.multiple = true;
    input.click();
    input.onchange = (e) => {
      const files = e.target.files;
      console.log(files);
      for (let i = 0; i < files.length; i++) {
        // uploadStockImage(
        //   product.id,
        //   color,
        //   files[i],
        //   (progress) => {
        //     console.log("on progress");
        //     console.log(progress);
        //   },
        //   (url, fileName) => {
        //     listStock[stockIndex].imageUrls.push(url);
        //     listStock[stockIndex].imageNames.push(fileName);
        //     setListStock([...listStock]);
        //   },
        //   (error) => {
        //     console.log("on error");
        //     console.error(error);
        //   }
        // );
        addStockImage(
          listStock[stockIndex],
          files[i],
          () => {
            showSnackbar("Image uploaded successfully!", "success");
            console.log("Image uploaded successfully!");
            setListStock([...listStock]);
          },
          (error) => {
            showSnackbar("Failed to upload image", "error");
            console.error(error);
          }
        );
      }
    };
  };

  const handleAddNewStock = (e) => {
    const newStock = new Stock(productId);
    addProductStock(
      productId,
      newStock.data(),
      (stockId) => {
        showSnackbar("Stock added successfully!", "success");
        newStock.id = stockId;
        setListStock([...listStock, newStock.data()]);
      },
      (error) => {
        showSnackbar("Failed to add stock", "error");
        console.error(error);
      }
    );
  };

  const handleDeleteStock = (e, stockId) => {
    deleteProductStock(
      productId,
      stockId,
      () => {
        showSnackbar("Stock deleted successfully!", "success");
        setListStock(listStock.filter((stock) => stock.id !== stockId));
      },
      (error) => {
        showSnackbar("Failed to delete stock", "error");
        console.error(error);
      }
    );
  };

  const handleSaveStocks = (e) => {
    let hasError = false;
    listStock.forEach((stock) => {
      saveProductStock(
        productId,
        stock,
        () => {
          if (!hasError) {
            showSnackbar("Stock updated successfully!", "success");
          }

          console.log("Stock %s updated successfully!", stock.id);
        },
        (error) => {
          hasError = true;
          showSnackbar("Failed to update stock: " + error, "error", true, 2000);
          console.error(error);
        }
      );
    });
  };

  const handleDeleteStockImage = (stock, imageIndex) => {
    deleteStockImage(
      stock,
      imageIndex,
      () => {
        showSnackbar("Image deleted successfully!", "success");
        setListStock([...listStock]);
      },
      (error) => {
        showSnackbar("Failed to delete image", "error");
        console.error(error);
      }
    );
  };

  const [hasErrorWhenFetchingStocks, setHasErrorWhenFetchingStocks] =
    useState(false);
  const [hasErrorWhenFetchingProduct, setHasErrorWhenFetchingProduct] =
    useState(false);

  useEffect(() => {
    getAllProductStocks(
      productId,
      (stocks) => {
        setListStock(stocks);
      },
      (error) => {
        console.error("Error getting stocks: ", error);
        if (hasErrorWhenFetchingStocks === false) {
          setHasErrorWhenFetchingStocks(true);
        }
      }
    );
  }, [productId, hasErrorWhenFetchingStocks]);

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

  if (listStock === null) {
    // spinner
    return (
      <>
        {hasErrorWhenFetchingStocks ? (
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
                setHasErrorWhenFetchingStocks(false);
                getAllProductStocks(
                  productId,
                  (stocks) => {
                    setListStock(stocks);
                  },
                  (error) => {
                    console.error("Error getting stocks: ", error);
                    if (hasErrorWhenFetchingStocks === false) {
                      setHasErrorWhenFetchingStocks(true);
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
    <Box
      sx={{
        overflowY: "auto",
        minHeight: "auto",
        display: "flex",
        flexGrow: 1,
        flexDirection: "column",
      }}
    >
      <Box
        sx={{
          overflowY: "auto",
          minHeight: "auto",
          display: "flex",
          flexGrow: 1,
          flexDirection: "column",
        }}
      >
        <Typography variant="h6">Stocks</Typography>
        <Grid container direction="row" spacing={2} marginBottom={5}>
          <Grid item xs={12} container>
            {listStock.map((stock, index) => {
              return (
                <Box key={"stock-" + index} padding={2} overflow="auto">
                  <Grid container spacing={2}>
                    <Grid item xs={11} container spacing={2}>
                      <Grid item xs={12} container spacing={2}>
                        <Grid item xs={2}>
                          <FormLabel>Color</FormLabel>
                        </Grid>
                        <Grid item xs={10}>
                          <TextField
                            value={stock.color}
                            fullWidth
                            onChange={(e) => {
                              stock.color = e.target.value;
                              setListStock([...listStock]);
                            }}
                          />
                        </Grid>
                      </Grid>
                      <Grid item xs={12} container spacing={2}>
                        <Grid item xs={2}>
                          <FormLabel>Last update</FormLabel>
                        </Grid>
                        <Grid item xs={10}>
                          <TextField
                            value={toSimpleDateString(stock.lastUpdate)}
                            type="date"
                            fullWidth
                            disabled
                          />
                        </Grid>
                      </Grid>
                      <Grid item xs={12} container spacing={2}>
                        <Grid item xs={2}>
                          <FormLabel>Quantity</FormLabel>
                        </Grid>
                        <Grid item xs={10}>
                          <TextField
                            value={stock.quantity}
                            type="number"
                            fullWidth
                            onChange={(e) => {
                              stock.quantity = parseInt(e.target.value);
                              setListStock([...listStock]);
                            }}
                          />
                        </Grid>
                      </Grid>
                      <Grid item xs={12} container spacing={2}>
                        <Grid item xs={2}>
                          <FormLabel>Variant</FormLabel>
                        </Grid>
                        <Grid item xs={10}>
                          <Select
                            value={stock.variantIndex}
                            fullWidth
                            onChange={(e) => {
                              stock.variantIndex = parseInt(e.target.value);
                              setListStock([...listStock]);
                            }}
                          >
                            {product.variantName.map((variantName, index) => {
                              return (
                                <MenuItem key={index} value={index}>
                                  {variantName +
                                    ": " +
                                    priceFormatter.format(
                                      product.variantPrice[index]
                                    )}
                                </MenuItem>
                              );
                            })}
                          </Select>
                        </Grid>
                      </Grid>
                      <Grid item xs={12} container spacing={2}>
                        <Grid item xs={2}>
                          <FormLabel>Image</FormLabel>
                        </Grid>
                        <Grid item xs={9}>
                          <Grid
                            spacing={2}
                            container
                            direction="row"
                            justifyContent="start"
                            alignItems="center"
                          >
                            {stock.imageUrls.map((url, index) => {
                              return (
                                <Grid item key={"stock-image-preview-" + url}>
                                  <Tooltip
                                    title={
                                      <img
                                        src={url}
                                        alt="Preview"
                                        style={{
                                          width: "100px",
                                          height: "auto",
                                        }}
                                      />
                                    }
                                  >
                                    <Chip
                                      label={stock.imageNames[index]}
                                      variant="outlined"
                                      onDelete={(e) => {
                                        handleDeleteStockImage(stock, index);
                                      }}
                                    />
                                  </Tooltip>
                                </Grid>
                              );
                            })}
                          </Grid>
                        </Grid>
                        <Grid item xs={1}>
                          <Button
                            onClick={(e) =>
                              handleUploadImage(stock.color, index)
                            }
                          >
                            Upload
                          </Button>
                        </Grid>
                      </Grid>
                    </Grid>
                    <Grid
                      item
                      xs={1}
                      container
                      direction="row"
                      justifyContent="center"
                      alignItems="center"
                    >
                      {/* Delete button with icon */}
                      {listStock.length > 1 && (
                        <IconButton
                          onClick={(e) => handleDeleteStock(e, stock.id)}
                        >
                          <DeleteOutline color="primary" />
                        </IconButton>
                      )}
                    </Grid>
                  </Grid>
                  {/* breakline */}
                  {listStock.length > 1 && (
                    <Box sx={{ height: "1px", backgroundColor: "grey.300" }} />
                  )}
                </Box>
              );
            })}
          </Grid>
        </Grid>
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "flex-end",
          gap: "10px",
          paddingBottom: "40px",
          paddingRight: "20px",
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          background: "white",
        }}
      >
        <Button
          variant="outlined"
          startIcon={<PlusIcon />}
          onClick={(e) => {
            handleAddNewStock(e);
          }}
        >
          Add new
        </Button>
        <Button
          variant="outlined"
          startIcon={<SaveOutlined />}
          onClick={(e) => {
            handleSaveStocks(e);
          }}
        >
          Save
        </Button>
      </Box>
    </Box>
  );
}

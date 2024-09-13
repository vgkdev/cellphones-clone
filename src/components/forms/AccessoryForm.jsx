import * as React from "react";
import {
  Accordion,
  AccordionActions,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Checkbox,
  Chip,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  Grid,
  IconButton,
  LinearProgress,
  TextField,
  ThemeProvider,
  Typography,
} from "@mui/material";
import FormGrid from "@mui/material/Grid";
import OutlinedInput from "@mui/material/OutlinedInput";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import { useState, useEffect } from "react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { DeleteOutline } from "@mui/icons-material";

import { PRODUCT_TYPES, Product } from "../../models/Product";
import {
  createAccessory,
  getProductById,
  updateProduct,
} from "../../db/dbProduct";
import { toNumArray } from "../../utils/num";
import { toSimpleDateString } from "../../utils/date";

import SetupProduct from "../../pages/components/dashboard/SetupProduct";
import { useSnackbarUtils } from "../../utils/useSnackbarUtils";
import BasicModal from "../../pages/components/dashboard/BasicModal";
import { onSnapshot } from "firebase/firestore";
import { PRODUCER_COLLECTION } from "../../db/dbProducer";
import {
  isValidHtml,
  normalizeSvg,
  priceFormatter,
} from "../../utils/stringHelper";
import { LoadingMessage } from "../../components/miscellaneous/SimpleLoadingDisplay";
import { violet_theme } from "../../theme/AppThemes";

//================================================
// Constants
//================================================
const FormValidation = {
  SUCCESS: "success",
  NONE: "",
};

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};
//================================================
//================================================

//================================================
// Utility functions
//================================================

function hasError(validation) {
  return (
    validation !== FormValidation.SUCCESS && validation !== FormValidation.NONE
  );
}

function getDataUnitArray(stringArr) {
  return stringArr.map((str) => {
    const unit = str.match(/[a-zA-Z]+/g)[0];
    return unit;
  });
}
//================================================
//================================================

//================================================
// Hardcoded stuffs, probably should be fetched
//================================================
const USAGES = [
  "Study",
  "Work",
  "Gaming",
  "Video editing",
  "Music production",
  "Photography",
  "Social media",
  "Entertainment",
  "Fitness",
  "Travel",
  "Business",
  "Casual",
  "Fashion",
  "Outdoor",
  "Indoor",
  "Professional",
  "Personal",
  "Family",
  "Health",
  "Productivity",
  "Art",
  "Design",
  "Development",
  "Programming",
  "Engineering",
  "Science",
  "Research",
  "Education",
];

//================================================
//================================================

export default function AccessoryForm({ productId = "" }) {
  // +========+
  // | states |
  // +========+
  const [autoReset, setAutoReset] = useState(true);
  const [product, setProduct] = useState(null);
  const [shouldOpenProductSetupModal, setShouldOpenProductSetupModal] =
    useState(false);
  const [targetProduct, setTargetProduct] = useState(null);

  // Basic info
  const [productName, setProductName] = useState(product ? product.name : "");
  const [overview, setOverview] = useState(product ? product.overview : "");
  // Variant
  const [variantsIndices, setVariantsIndices] = useState(
    product ? Array.from({ length: product.variantCount }, (_, i) => i) : [0]
  );
  const [variantCount, setVariantCount] = useState(
    product ? product.variantCount : 1
  );
  const [newVariantIndex, setNewVariantIndex] = useState(
    product ? product.variantCount : 1
  );
  const [variantName, setVariantName] = useState(
    product ? product.variantName : [""]
  );
  const [variantPrice, setVariantPrice] = useState(
    product ? product.variantPrice : [0]
  );

  // +======================+
  // | validation states    |
  // +======================+
  const [productNameValidation, setProductNameValidation] = useState(
    FormValidation.NONE
  );
  const [overviewValidation, setOverviewValidation] = useState(
    FormValidation.NONE
  );

  // +======================+
  // | validation functions |
  // +======================+
  const validateProductName = (value) => {
    // doh't use state value because it's async, use dependency value instead
    if (value === "") {
      setProductNameValidation("Product name is required");
      return false;
    } else if (value.length < 3) {
      setProductNameValidation("Product name must be at least 3 characters");
      return false;
    }
    setProductNameValidation(FormValidation.SUCCESS);
    return true;
  };
  const validateOverview = (val) => {
    setOverviewValidation(FormValidation.SUCCESS);
    return true;
  };

  const { showSnackbar } = useSnackbarUtils();

  // +======================+
  // | event handlers       |
  // +======================+
  const handleProductNameChange = (event) => {
    setProductName(event.target.value);
    validateProductName(event.target.value);
  };
  const handleOverviewChange = (event) => {
    setOverview(event.target.value);
    validateOverview(event.target.value);
  };

  // Button handlers
  const handleNewVariant = () => {
    setVariantCount((prevCount) => {
      const newCount = prevCount + 1;
      setNewVariantIndex((prevIndex) => {
        setVariantsIndices((prevIndices) => [...prevIndices, prevIndex]);
        return prevIndex + 1;
      });
      return newCount;
    });
    setVariantPrice([...variantPrice, 0]);
  };

  const handleDeleteVariant = (index) => {
    if (variantCount === 1) {
      return;
    }
    setVariantCount((prevCount) => {
      const newCount = prevCount - 1;
      setVariantsIndices((prevIndices) => {
        const newIndices = [...prevIndices];
        newIndices.splice(index, 1);
        return newIndices;
      });
      return newCount;
    });
    setVariantName((prevNames) => {
      const newNames = [...prevNames];
      newNames.splice(index, 1);
      return newNames;
    });
    setVariantPrice((prevPrice) => {
      const newPrice = [...prevPrice];
      newPrice.splice(index, 1);
      return newPrice;
    });
  };

  const handleVariantNameChange = (event, index) => {
    const { value } = event.target;
    setVariantName((prevNames) => {
      const newNames = [...prevNames];
      newNames[index] = value;
      return newNames;
    });
  };

  const handleVariantPriceChange = (event, index) => {
    const { value } = event.target;
    setVariantPrice((prevPrice) => {
      const newPrice = [...prevPrice];
      newPrice[index] = value;
      return newPrice;
    });
  };

  useEffect(() => {
    if (productId) {
      getProductById(
        productId,
        (product) => {
          setProduct(product);
        },
        (error) => {
          showSnackbar(error.message, "error");
        }
      );
    }
  }, [productId]);

  // +===================================+
  // | update product field if is editing|
  // +===================================+
  useEffect(() => {
    if (product) {
      setProductName(product.name);

      setOverview(product.overview);

      setVariantCount(product.variantCount);
      setVariantsIndices(
        Array.from({ length: product.variantCount }, (_, i) => i)
      );
      setVariantName(product.variantName);

      setVariantPrice(product.variantPrice);
    }
  }, [product]);

  if (product === null && productId) {
    return <LoadingMessage />;
  }

  // Form Actions
  const validateAll = () => {
    let result = true;
    if (!validateProductName(productName)) result = false;

    if (!validateOverview(overview)) result = false;

    return result;
  };

  const submitForm = (e) => {
    console.log("submitting form");

    if (!validateAll()) {
      showSnackbar("The form contains errors", "warning", true);
      return;
    }

    const targetProduct = new Product();
    targetProduct.name = productName;

    targetProduct.overview = overview;
    targetProduct.variantCount = Number(variantCount);
    targetProduct.variantName = variantName;
    targetProduct.variantPrice = toNumArray(variantPrice);
    targetProduct.productType = PRODUCT_TYPES.ACCESSORY;

    if (product === null) {
      console.log("adding product");

      createAccessory(
        targetProduct.data(),
        (returnProduct) => {
          showSnackbar("Product added successfully", "success");
          if (autoReset) resetForm();
          setTargetProduct(returnProduct);
          setShouldOpenProductSetupModal(true);
        },
        (error) => {
          console.log("error adding product", error);
          showSnackbar("Error adding product" + error, "error", true);
        }
      );
    } else {
      // update product
      console.log("updating product");
      product.name = productName;

      product.overview = overview;
      product.variantCount = Number(variantCount);
      product.variantName = variantName;

      product.variantPrice = toNumArray(variantPrice);

      updateProduct(
        product,
        product.id,
        () => {
          showSnackbar("Product updated successfully", "success");
        },
        (error) => {
          console.log("error updating product", error);
          showSnackbar("Error updating product" + error, "error", true);
        }
      );
    }
  };

  const resetForm = () => {
    setProductName("");

    setOverview("");
    setVariantsIndices([0]);
    setVariantCount(1);
    setNewVariantIndex(1);
    setVariantName([""]);
    setVariantPrice([0]);

    // reset all validation states
    setProductNameValidation("");
    setOverviewValidation("");
  };

  return (
    <ThemeProvider theme={violet_theme}>
      <Typography variant="subtitle1">
        {product ? "Editing" : "Adding"}
      </Typography>
      {/* form body */}
      <Box sx={{ width: "100%" }}>
        <FormGrid container spacing={2}>
          {/* Rudimentary information */}
          <FormGrid item xs={12} md={6}>
            <FormLabel>Name</FormLabel>
            <TextField
              required
              id="name"
              name="name"
              label="Product Name"
              fullWidth
              value={productName}
              onChange={(e) => handleProductNameChange(e)}
              error={hasError(productNameValidation)}
              helperText={
                hasError(productNameValidation) ? productNameValidation : null
              }
            />
          </FormGrid>

          <FormGrid item xs={12} md={12}>
            <FormLabel>Overview</FormLabel>
            <TextField
              id="overview"
              name="Product overview"
              label="Overview"
              fullWidth
              value={overview}
              multiline
              rows={4}
              onChange={(e) => handleOverviewChange(e)}
              error={hasError(overviewValidation)}
              helperText={
                hasError(overviewValidation) ? overviewValidation : null
              }
            />
          </FormGrid>
          {/* Variants */}
          <FormGrid item xs={12} md={12}>
            <Accordion defaultExpanded>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="memory-storage-header"
                id="memory-storage-header"
              >
                <Typography variant="caption">Variants</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Grid
                  container
                  direction="column"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  {variantsIndices.map((index) => (
                    <Grid
                      item
                      md={2}
                      xs={2}
                      key={index}
                      sx={{
                        border: "1px solid #ccc",
                        padding: "10px",
                        width: "100%",
                        borderRadius: "5px",
                        marginBottom: "10px",
                      }}
                    >
                      <FormGrid container spacing={2}>
                        <FormGrid item xs={11} md={11} container>
                          <FormGrid item xs={12} md={12} container spacing={2}>
                            <FormGrid
                              item
                              xs={12}
                              md={12}
                              container
                              spacing={2}
                            >
                              <FormGrid item xs={2} md={2}>
                                <FormLabel>Name</FormLabel>
                              </FormGrid>
                              <FormGrid item xs={10} md={10}>
                                <TextField
                                  required
                                  id={"variant-name" + index}
                                  name={"variant-name" + index}
                                  label="Variant name"
                                  fullWidth
                                  onChange={(e) =>
                                    handleVariantNameChange(
                                      e,
                                      variantsIndices.indexOf(index)
                                    )
                                  }
                                  value={
                                    variantName[
                                      variantsIndices.indexOf(index)
                                    ] || ""
                                  }
                                />
                              </FormGrid>
                            </FormGrid>

                            <FormGrid
                              item
                              xs={12}
                              md={12}
                              container
                              spacing={2}
                            >
                              <FormGrid item xs={2} md={2}>
                                <FormLabel>Price</FormLabel>
                              </FormGrid>
                              <FormGrid item xs={10} md={10}>
                                <TextField
                                  required
                                  id={"price" + index}
                                  name={"price" + index}
                                  label={priceFormatter.format(
                                    variantPrice[
                                      variantsIndices.indexOf(index)
                                    ] || 0
                                  )}
                                  fullWidth
                                  type="number"
                                  onChange={(e) =>
                                    handleVariantPriceChange(
                                      e,
                                      variantsIndices.indexOf(index)
                                    )
                                  }
                                  value={
                                    variantPrice[
                                      variantsIndices.indexOf(index)
                                    ] || 0
                                  }
                                />
                              </FormGrid>
                            </FormGrid>
                          </FormGrid>
                        </FormGrid>
                        <FormGrid
                          item
                          xs={1}
                          md={1}
                          container
                          direction="row"
                          justifyContent="center"
                          alignItems="center"
                        >
                          {/* Delete button with icon */}
                          {!productId && variantCount > 1 && (
                            <IconButton
                              onClick={() =>
                                handleDeleteVariant(
                                  variantsIndices.indexOf(index)
                                )
                              }
                            >
                              <DeleteOutline color="primary" />
                            </IconButton>
                          )}
                        </FormGrid>
                      </FormGrid>
                    </Grid>
                  ))}
                </Grid>
              </AccordionDetails>
              <AccordionActions>
                <Button onClick={() => handleNewVariant()}>New variant</Button>
              </AccordionActions>
            </Accordion>
          </FormGrid>
        </FormGrid>

        <Box
          style={{ position: "sticky", bottom: 0 }}
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "10px",
            zIndex: 10,
            backgroundColor: "white",
          }}
        >
          {productId !== "" ? (
            <Button
              onClick={() => {
                submitForm();
              }}
              variant="contained"
            >
              Save
            </Button>
          ) : (
            <Box>
              <Button
                onClick={() => {
                  resetForm();
                }}
              >
                Reset
              </Button>
              <FormControlLabel
                control={
                  <Checkbox
                    color="primary"
                    checked={autoReset}
                    onChange={(e) => {
                      setAutoReset(e.target.checked);
                    }}
                  />
                }
                label="Auto reset"
                key="btn-auto-reset"
              />
              <Button
              variant="contained"
              onClick={() => {
                submitForm();
              }}
            >
              Create
            </Button>
            </Box>
          )}
        </Box>
      </Box>

      {shouldOpenProductSetupModal && (
        <BasicModal
          childComponent={() => (
            <SetupProduct
              product={targetProduct}
              onFinished={() => setShouldOpenProductSetupModal(false)}
            />
          )}
        />
      )}
    </ThemeProvider>
  );
}

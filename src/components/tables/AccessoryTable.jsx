import * as React from "react";
import {
  AppBar,
  Box,
  Button,
  Chip,
  Dialog,
  DialogContent,
  Grid,
  IconButton,
  LinearProgress,
  Slide,
  Tab,
  Tabs,
  Toolbar,
  Typography,
} from "@mui/material";
import { PRODUCT_TYPES } from "../../models/Product";
import PropTypes from "prop-types";
import { useState } from "react";
import { useSnackbarUtils } from "../../utils/useSnackbarUtils";
import { PRODUCT_COLLECTION, getAllProducts } from "../../db/dbProduct";
import { useEffect } from "react";
import { onSnapshot } from "firebase/firestore";
import {
  Close,
  Preview,
  Refresh,
  SentimentDissatisfied,
} from "@mui/icons-material";
import MUIDataTable from "mui-datatables";
import AccessoryForm from "../forms/AccessoryForm";
import ManageProductRating from "../../pages/components/dashboard/ManageProductRating";
import ManageProductStock from "../../pages/components/dashboard/ManageProductStock";
import ManageProductImageAndVideo from "../../pages/components/dashboard/ManageProductImageAndVideo";
import ManagePost from "../../pages/components/dashboard/ManagePost";
import ManageFAQ from "../../pages/components/dashboard/ManageFAQ";

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <div>{children}</div>
        </Box>
      )}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export function AccessoryTable() {
  // const [productList, setProductList] = useState([]);
  const [data, setData] = React.useState([[]]);

  const [isFetchingProductList, setIsFetchingProductList] = useState(true);
  const [hasErrorFetchingProductList, setHasErrorFetchingProductList] =
    useState(false);

  // dialog states
  const [shouldOpenEditDialog, setShouldOpenEditDialog] = useState(false);
  const [onFocusProductId, setOnFocusProductId] = useState(null);
  const [onFucusProductName, setOnFocusProductName] = useState(null);
  const [tabValue, setTabValue] = React.useState(0);

  //utils
  const { showSnackbar } = useSnackbarUtils();
  const getDataForTable = (products) => {
    let data = [];
    products.forEach((product) => {
      data.push([
        product.id,
        product.name,
        product.lastUpdate,
        product.isConfigured,
        product.id,
      ]);
    });
    return data;
  };

  // handlers
  const handleOpenEditDialog = () => {
    setShouldOpenEditDialog(true);
  };
  const handleCloseEditDialog = () => {
    setShouldOpenEditDialog(false);
  };
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  //fetch data
  const fetchProductList = async () => {
    try {
      getAllProducts(
        (products) => {
          console.log(products);
          setData(
            getDataForTable(
              products.filter(
                (product) => product.productType === PRODUCT_TYPES.ACCESSORY
              )
            )
          );
        },
        (error) => {
          showSnackbar("Failed to fetch product list %s", error, "error");
          setHasErrorFetchingProductList(true);
        }
      );
    } catch (error) {
      showSnackbar("Failed to fetch product list", "error");
    } finally {
      setIsFetchingProductList(false);
    }
  };

  // register firebase snapshot listener
  useEffect(() => {
    const unsubscribe = onSnapshot(PRODUCT_COLLECTION, (snapshot) => {
      console.log("snapshot");
      fetchProductList();
    });
    return unsubscribe;
  }, []);

  if (isFetchingProductList) {
    return (
      <Grid>
        <p>Loading ...</p>
        <Box sx={{ width: "100%" }}>
          <LinearProgress />
        </Box>
      </Grid>
    );
  }

  if (hasErrorFetchingProductList) {
    return (
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
      >
        <SentimentDissatisfied />
        <p>Error while fetching products</p>
        <Button
          onClick={(e) => {
            setHasErrorFetchingProductList(false);
            fetchProductList();
          }}
          variant="outlined"
          startIcon={<Refresh />}
        >
          Retry
        </Button>
      </Box>
    );
  }

  // data table
  const columns = [
    {
      name: "Id",
      options: {
        filter: false,
      },
    },
    {
      name: "Name",
      options: {
        filter: false,
      },
    },
    {
      name: "Last Update",
      options: {
        filter: true,
        customBodyRender: (value, tableMeta, updateValue) => {
          const date = new Date(value);
          return <p>{date.toLocaleString()}</p>;
        },
      },
    },
    {
      name: "Congifured?",
      options: {
        filter: true,
        customBodyRender: (value, tableMeta, updateValue) => {
          return (
            <Chip
              color={value ? "primary" : "secondary"}
              label={value ? "Yes" : "No"}
            />
          );
        },
      },
    },
    {
      name: "Action",
      options: {
        filter: false,
        sort: false,
        customBodyRender: (value, tableMeta, updateValue) => {
          return (
            <Box sx={{ width: "100%" }}>
              <Grid
                container
                direction="row"
                justifyContent="center"
                alignItems="center"
                spacing={0.5}
              >
                <Grid item>
                  <Button
                    size="small"
                    variant="contained"
                    onClick={(e) => {
                      handleOpenEditDialog();
                      setOnFocusProductId(value);
                      setOnFocusProductName(tableMeta.rowData[1]);
                    }}
                  >
                    Edit
                  </Button>
                </Grid>
                <Grid item>
                  <Button
                    size="small"
                    variant="outlined"
                    startIcon={<Preview />}
                    onClick={(e) => {
                      window.open(
                        `/dashboard/products/preview-product?productId=${value}`
                      );
                    }}
                  >
                    Preview
                  </Button>
                </Grid>
              </Grid>
            </Box>
          );
        },
      },
    },
  ];

  const options = {
    filter: true,
    filterType: "dropdown",
    responsive: "standard",
    draggableColumns: { enabled: true, transitionTime: 500 },
    expandableRowsHeader: true,
    storageKey: "accessoriesDataTable",
    resizableColumns: true,
    selectableRows: "single",
  };

  return (
    <>
      <MUIDataTable
        title={"Accessories List"}
        data={data}
        columns={columns}
        options={options}
      />
      <Dialog
        fullScreen
        open={shouldOpenEditDialog && onFocusProductId !== null}
        onClose={handleCloseEditDialog}
        TransitionComponent={Transition}
      >
        <AppBar sx={{ position: "relative" }}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={handleCloseEditDialog}
              aria-label="close"
            >
              <Close />
            </IconButton>
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
              {onFocusProductId + " - " + onFucusProductName + " - Edit"}
            </Typography>
            <Button autoFocus color="inherit" onClick={handleCloseEditDialog}>
              Close without Saving
            </Button>
          </Toolbar>
        </AppBar>
        <DialogContent>
          <Box
            sx={{
              borderBottom: 1,
              borderColor: "divider",
              position: "sticky",
              top: 0,
              zIndex: 99,
              backgroundColor: "white",
            }}
          >
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              aria-label="edit product tabs"
              variant="fullWidth"
            >
              <Tab label="Spec" {...a11yProps(0)} />
              <Tab label="Rating" {...a11yProps(1)} />
              <Tab label="Stock" {...a11yProps(2)} />
              <Tab label="Images & Video" {...a11yProps(3)} />
              <Tab label="Post" {...a11yProps(4)} />
              <Tab label="FAQ" {...a11yProps(5)} />
            </Tabs>
          </Box>
          <CustomTabPanel value={tabValue} index={0}>
            <AccessoryForm productId={onFocusProductId} />
          </CustomTabPanel>
          <CustomTabPanel value={tabValue} index={1}>
            <ManageProductRating productId={onFocusProductId} />
          </CustomTabPanel>
          <CustomTabPanel value={tabValue} index={2}>
            <ManageProductStock productId={onFocusProductId} />
          </CustomTabPanel>
          <CustomTabPanel value={tabValue} index={3}>
            <ManageProductImageAndVideo productId={onFocusProductId} />
          </CustomTabPanel>
          <CustomTabPanel value={tabValue} index={4}>
            <ManagePost productId={onFocusProductId} />
          </CustomTabPanel>
          <CustomTabPanel value={tabValue} index={5}>
            <ManageFAQ productId={onFocusProductId} />
          </CustomTabPanel>
        </DialogContent>
      </Dialog>
    </>
  );
}

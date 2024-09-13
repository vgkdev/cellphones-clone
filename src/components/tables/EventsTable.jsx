import { Box, Button, ThemeProvider, Typography } from "@mui/material";
import * as React from "react";
import { violet_theme } from "../../theme/AppThemes";
import { useState } from "react";
import { useEffect } from "react";
import { VOUCHER_COLLECTION, getAllVouchers } from "../../db/dbVoucher";
import MUIDataTable from "mui-datatables";
import {
  AirplanemodeActiveOutlined,
  DeblurOutlined,
  Edit,
} from "@mui/icons-material";
import { onSnapshot } from "firebase/firestore";
import { max } from "moment";
import { current } from "@reduxjs/toolkit";
import { Event } from "../../models/Event";
import { EVENT_COLLECTION } from "../../db/dbEvent";
import { render } from "@testing-library/react";
import { useDispatch, useSelector } from "react-redux";
import { getAllProducts } from "../../store/actions/productsAction";
import { updateProduct } from "../../db/dbProduct";
import { useSnackbarUtils } from "../../utils/useSnackbarUtils";
import { priceFormatter } from "../../utils/stringHelper";
import { calculateEventDiscount } from "../../utils/product";

export default function EventsTable({ onEditEvent = null }) {
  const [events, setEvents] = useState([]);
  const { products, loading, error } = useSelector((state) => state.products);
  const dispatch = useDispatch();
  const { showSnackbar } = useSnackbarUtils();

  const getDataForTable = (events) => {
    let data = [];
    events.forEach((event) => {
      data.push({
        id: event.id,
        name: event.name,
        title: event.title,
        discountRate: event.discountRate * 100 + "%",
        maxDiscount: priceFormatter.format(event.maxDiscount),
        isExclusive: event,
        displayImageUrl: event.displayImageUrl,
        startDate: event.startTime,
        endDate: event.endTime,
        Actions: event,
      });
    });
    return data;
  };

  const handleActivateEvent = async (e) => {
    let hasError = false;
    if (!e.isExclusive) {
      try {
        await Promise.all(
          products.map(async (product) => {
            const updatedProduct = { ...product, activeEvent: e.id };
            updatedProduct.finalPrices = updatedProduct.variantPrice.map(
              (price) =>
                price -
                calculateEventDiscount(price, e.discountRate, e.maxDiscount)
            );
            await updateProduct(updatedProduct, product.id, null, (error) => {
              if (error) {
                hasError = true;
              }
            });
          })
        );
      } catch (error) {
        // Handle any errors that occur during the update
        console.error("Error updating products:", error);
        hasError = true;
      }
    } else {
      e.applicableProducts.forEach(async (productId) => {
        const updatedProduct = {
          ...products.find((product) => product.id === productId),
          activeEvent: e.id,
        };
        updatedProduct.finalPrices = updatedProduct.variantPrice.map(
          (price) =>
            price - calculateEventDiscount(price, e.discountRate, e.maxDiscount)
        );
        await updateProduct(
          updatedProduct,
          productId,
          null,
          (error) => {
            if (error) {
              hasError = true;
            }
          }
        );
      });
    }

    if (hasError) {
      showSnackbar("Error activating event", "error");
    } else {
      showSnackbar("Event activated", "success");
    }
  };

  const handleDeactivateEvent = async (e) => {
    let hasError = false;
    if (!e.isExclusive) {
      try {
        await Promise.all(
          products.map(async (product) => {
            if (product.activeEvent === e.id) {
              const updatedProduct = { ...product, activeEvent: "" };
              updatedProduct.finalPrices = updatedProduct.variantPrice;
              await updateProduct(updatedProduct, product.id, null, (error) => {
                if (error) {
                  hasError = true;
                }
              });
            }
          })
        );
      } catch (error) {
        // Handle any errors that occur during the update
        console.error("Error updating products:", error);
        hasError = true;
      }
    } else {
      e.applicableProducts.forEach(async (productId) => {
        const updatedProduct = {
          ...products.find((product) => product.id === productId),
        };

        if (updatedProduct.activeEvent === e.id) {
          updatedProduct.activeEvent = "";
          updatedProduct.finalPrices = updatedProduct.variantPrice;
          await updateProduct(updatedProduct, productId, null, (error) => {
            if (error) {
              hasError = true;
            }
          });
        }
      });
    }

    if (hasError) {
      showSnackbar("Error deactivating event", "error");
    } else {
      showSnackbar("Event deactivated", "success");
    }
  };

  const columns = [
    {
      name: "id",
      options: {
        filter: false,
        display: false,
      },
    },
    {
      name: "name",
      label: "Name",
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: "title",
      label: "Title",
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: "discountRate",
      label: "Discount Rate",
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: "maxDiscount",
      label: "Max Discount",
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: "isExclusive",
      label: "Is Exclusive",
      options: {
        filter: true,
        sort: true,
        customBodyRender: (value, tableMeta, updateValue) => {
          return (
            <Box>
              {value.isExclusive ? (
                <Typography variant="body1" color="success">
                  {value.applicableProducts
                    .map(
                      (productId) =>
                        products.find((product) => product.id === productId)
                          .name
                    )
                    .join(", ")}
                </Typography>
              ) : (
                <Typography variant="body1" color="error">
                  All
                </Typography>
              )}
            </Box>
          );
        },
      },
    },
    {
      name: "displayImageUrl",
      label: "Display Image",
      options: {
        filter: true,
        sort: true,
        customBodyRender: (value, tableMeta, updateValue) => {
          return (
            <img
              src={value}
              alt="display event"
              style={{ width: 100, height: 100 }}
            />
          );
        },
      },
    },
    {
      name: "startDate",
      label: "Start Date",
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: "endDate",
      label: "End Date",
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: "Actions",
      options: {
        filter: false,
        sort: false,
        empty: true,
        customBodyRender: (value, tableMeta, updateValue) => {
          return (
            <Box
              gap={2}
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexWrap: "wrap",
              }}
            >
              <Button
                variant="contained"
                color="primary"
                size="small"
                startIcon={<Edit />}
                onClick={() => {
                  console.log("Edit voucher " + value);
                  if (onEditEvent) {
                    onEditEvent(value.id);
                  } else {
                    console.error("onEditEvent is not set");
                  }
                }}
              >
                Edit
              </Button>
              <Button
                variant="contained"
                color="primary"
                size="small"
                startIcon={<AirplanemodeActiveOutlined />}
                onClick={() => {
                  console.log("Activate event " + value);
                  handleActivateEvent(value);
                }}
              >
                Activate event
              </Button>
              <Button
                variant="contained"
                color="primary"
                size="small"
                startIcon={<DeblurOutlined />}
                onClick={() => {
                  console.log("Activate event " + value);
                  handleDeactivateEvent(value);
                }}
              >
                Deactivate event
              </Button>
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
    storageKey: "eventsDataTable",
    resizableColumns: true,
    selectableRows: "single",
  };

  useEffect(() => {
    const unsubscribe = onSnapshot(EVENT_COLLECTION, (snapshot) => {
      const events = [];
      snapshot.forEach((doc) => {
        events.push(doc.data());
      });
      setEvents(events);
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    if (products.length === 0) {
      dispatch(getAllProducts());
    }
  }, [products.length]);

  return (
    <ThemeProvider theme={violet_theme}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          width: "100%",
        }}
        gap={2}
      >
        <Typography
          variant="h6"
          sx={{
            display: "flex",
            justifyContent: "start",
            alignItems: "start",
          }}
          color="primary"
        >
          Events table
        </Typography>

        <MUIDataTable
          title={"Events"}
          data={getDataForTable(events)}
          columns={columns}
          options={options}
        />
      </Box>
    </ThemeProvider>
  );
}

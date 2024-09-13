import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  Chip,
  CircularProgress,
  Tabs,
  Tab,
  Badge,
} from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import { DataGrid } from "@mui/x-data-grid";
import { violet_theme } from "../../theme/AppThemes";
import { getUserOrders } from "../../db/dbOrder";
import { formatDateTime, priceFormatter } from "../../utils/stringHelper";
import { ORDER_STATUS } from "../../models/Order";
import { useSelector } from "react-redux";

const OrderTable = ({ orders, onSelectOrder }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case ORDER_STATUS.PENDING:
        return "default";
      case ORDER_STATUS.CONFIRMED:
        return "info";
      case ORDER_STATUS.COMPLETED:
        return "success";
      case ORDER_STATUS.CANCELLED:
        return "error";
      case ORDER_STATUS.DELIVERING:
        return "primary";
      case ORDER_STATUS.REFUNDED:
        return "warning";
      default:
        return "default";
    }
  };

  const renderProducts = (products, descriptions, prices, quantities) => {
    return products.map((_, index) => (
      <Box key={index} display="flex" alignItems="center" my={0.5}>
        <Typography variant="body2" component="span">
          {products[index]}:
        </Typography>
        <Typography variant="body2" component="span" sx={{ mx: 1 }}>
          {descriptions[index]}
        </Typography>
        <Typography variant="body2" component="span" sx={{ mx: 1 }}>
          {priceFormatter.format(prices[index])}
        </Typography>
        <Typography variant="body2" component="span">
          x {quantities[index]}
        </Typography>
      </Box>
    ));
  };

  const columns = [
    { field: "id", headerName: "Order ID", width: 200 },
    {
      field: "status",
      headerName: "Status",
      width: 150,
      renderCell: (params) => (
        <Chip label={params.value} color={getStatusColor(params.value)} />
      ),
    },
    {
      field: "total",
      headerName: "Total",
      width: 150,
      valueFormatter: (value) => priceFormatter.format(value),
    },
    {
      field: "products",
      headerName: "Products",
      width: 600,
      renderCell: (params) => (
        <div>
          {renderProducts(
            params.row.productNames,
            params.row.productDescriptions,
            params.row.productPrices,
            params.row.quantities
          )}
        </div>
      ),
    },
    { field: "name", headerName: "Name", width: 150 },
    { field: "phoneNumber", headerName: "Phone number", width: 150 },
    { field: "address", headerName: "Address", width: 500 },
    {
      field: "dateCreate",
      headerName: "Date create",
      width: 150,

      valueFormatter: (value) => formatDateTime(value),
    },
  ];

  return (
    <Paper style={{ height: 600, width: "100%" }}>
      <DataGrid
        rows={orders}
        columns={columns}
        pageSize={10}
        rowsPerPageOptions={[10, 25, 50]}
        onRowClick={(params) => onSelectOrder(params.row)}
        sx={{
          "& .MuiDataGrid-row:hover": {
            backgroundColor: "rgba(0, 0, 0, 0.04)",
          },
        }}
      />
    </Paper>
  );
};

const OrderDetail = ({ order }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case ORDER_STATUS.PENDING:
        return "default";
      case ORDER_STATUS.CONFIRMED:
        return "info";
      case ORDER_STATUS.COMPLETED:
        return "success";
      case ORDER_STATUS.CANCELLED:
        return "error";
      case ORDER_STATUS.DELIVERING:
        return "primary";
      case ORDER_STATUS.REFUNDED:
        return "warning";
      default:
        return "default";
    }
  };

  return (
    <Box component={Paper} padding={2}>
      {order !== null ? (
        <>
          <Typography variant="h6">Order Details</Typography>
          <Typography variant="body1">Order ID: {order.id}</Typography>
          <Typography variant="body1">
            Status:{" "}
            <Chip label={order.status} color={getStatusColor(order.status)} />
          </Typography>
          <Typography variant="body1">
            Total: {priceFormatter.format(order.total)}
          </Typography>
          <Typography variant="body1">Address: {order.address}</Typography>
        </>
      ) : (
        <Typography variant="h6">Select an order to view details</Typography>
      )}
    </Box>
  );
};

export default function UserOrderPage() {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tabIndex, setTabIndex] = useState(0);

  const user = useSelector((state) => state.user.user);

  useEffect(() => {
    getUserOrders(
      user.id,
      (orders) => {
        console.log(">>>check get user orders: ", orders);
        setOrders(orders);
        setLoading(false);
      },
      (error) => {
        console.error(">>>error get all orders: ", error);
        setLoading(false);
      }
    );
  }, [user.id]);

  const handleSelectOrder = (order) => {
    setSelectedOrder(order);
  };

  const handleChangeTab = (event, newIndex) => {
    setTabIndex(newIndex);
    setSelectedOrder(null);
  };

  const getBadgeCount = (status) => {
    return orders.filter((order) => order.status === status).length;
  };

  const filteredOrders = orders.filter((order) => {
    switch (tabIndex) {
      case 0:
        return order.status === ORDER_STATUS.PENDING;
      case 1:
        return order.status === ORDER_STATUS.CONFIRMED;
      case 2:
        return order.status === ORDER_STATUS.COMPLETED;
      case 3:
        return order.status === ORDER_STATUS.CANCELLED;
      case 4:
        return order.status === ORDER_STATUS.DELIVERING;
      case 5:
        return order.status === ORDER_STATUS.REFUNDED;
      default:
        return true;
    }
  });

  return (
    <ThemeProvider theme={violet_theme}>
      <Container sx={{ my: "20px" }}>
        <Tabs
          value={tabIndex}
          onChange={handleChangeTab}
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab
            label={
              <Badge
                badgeContent={getBadgeCount(ORDER_STATUS.PENDING)}
                color="primary"
              >
                Pending
              </Badge>
            }
          />
          <Tab
            label={
              <Badge
                badgeContent={getBadgeCount(ORDER_STATUS.CONFIRMED)}
                color="primary"
              >
                Confirmed
              </Badge>
            }
          />
          <Tab
            label={
              <Badge
                badgeContent={getBadgeCount(ORDER_STATUS.COMPLETED)}
                color="primary"
              >
                Completed
              </Badge>
            }
          />
          <Tab
            label={
              <Badge
                badgeContent={getBadgeCount(ORDER_STATUS.CANCELLED)}
                color="primary"
              >
                Cancelled
              </Badge>
            }
          />
          <Tab
            label={
              <Badge
                badgeContent={getBadgeCount(ORDER_STATUS.DELIVERING)}
                color="primary"
              >
                Delivering
              </Badge>
            }
          />
          <Tab
            label={
              <Badge
                badgeContent={getBadgeCount(ORDER_STATUS.REFUNDED)}
                color="primary"
              >
                Refunded
              </Badge>
            }
          />
        </Tabs>
        <Grid container spacing={2} sx={{ marginTop: 2 }}>
          <Grid item xs={12}>
            {loading ? (
              <CircularProgress />
            ) : (
              <OrderTable
                orders={filteredOrders}
                onSelectOrder={handleSelectOrder}
              />
            )}
          </Grid>
          {/* <Grid item xs={5}>
            <OrderDetail order={selectedOrder} />
          </Grid> */}
        </Grid>
      </Container>
    </ThemeProvider>
  );
}

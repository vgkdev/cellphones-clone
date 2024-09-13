import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import { DataGrid } from "@mui/x-data-grid";
import { violet_theme } from "../../theme/AppThemes";
import { getAllOrders, updateOrder } from "../../db/dbOrder";
import Dashboard from "../components/dashboard/Dashboard";
import { formatDateTime, priceFormatter } from "../../utils/stringHelper";
import { ORDER_STATUS } from "../../models/Order";
import { NOTIFICATION_CODE, Notification } from "../../models/Notification";
import { addNotification } from "../../db/dbNotification";
import { useSnackbarUtils } from "../../utils/useSnackbarUtils";

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
    { field: "id", headerName: "Order ID", width: 150 },
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
    {
      field: "dateCreate",
      headerName: "Date create",
      width: 150,
      valueFormatter: (params) => formatDateTime(params.value),
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

const OrderDetail = ({ order, onUpdateOrder, closeOrderDetail }) => {
  const [editableOrder, setEditableOrder] = useState(null);
  // const [notification, setNotification] = useState(new Notification().data());

  const { showSnackbar } = useSnackbarUtils();

  useEffect(() => {
    setEditableOrder(order);
  }, [order]);

  const handleChangeStatus = (e) => {
    const { value } = e.target;
    setEditableOrder({ ...editableOrder, status: value });
  };
  const translateStatusToVietnamese = (status) => {
    switch (status) {
      case "PENDING":
        return "Đang chờ xử lý";
      case "CONFIRMED":
        return "Đã xác nhận";
      case "DELIVERING":
        return "Đang giao hàng";
      case "COMPLETED":
        return "Hoàn thành";
      case "CANCELLED":
        return "Đã hủy";
      case "REFUNDED":
        return "Đã hoàn tiền";
      default:
        return status;
    }
  };

  const handleSaveStatus = () => {
    if (editableOrder) {
      onUpdateOrder(editableOrder);
      console.log(">>>check update status: ", editableOrder);
      if (editableOrder.userId) {
        let notification = new Notification().data();
        notification = {
          ...notification,
          code: NOTIFICATION_CODE.ORDER_STATUS_CHANGED,
          title: `Cập nhật trạng thái đơn hàng`,
          content: `Đơn hàng ${
            editableOrder.id
          } của bạn đã được cập nhật trạng thái: ${translateStatusToVietnamese(
            editableOrder.status
          )}`,
        };

        addNotification(
          editableOrder.userId,
          notification,
          (notiId) => {
            console.log("Notification sent successfully with ID:", notiId);
            showSnackbar("Notification sent successfully", "success");
          },
          (error) => {
            console.error("Failed to send notification:", error);
            showSnackbar("Failed to send notification", "error");
          }
        );
      }
    }
  };

  return (
    <Box component={Paper} padding={2}>
      {editableOrder !== null ? (
        <>
          <Typography variant="h6">Order Details</Typography>
          <Typography variant="body1">Order ID: {editableOrder.id}</Typography>
          <Typography variant="body1">
            Total: {priceFormatter.format(editableOrder.total)}
          </Typography>
          <Typography variant="body1">
            Address: {editableOrder.address}
          </Typography>
          <Typography variant="body1">Name: {editableOrder.name}</Typography>
          <Typography variant="body1">
            Phone number: {editableOrder.phoneNumber}
          </Typography>
          <Typography variant="body1">
            Date create: {formatDateTime(editableOrder.dateCreate)}
          </Typography>
          <TableContainer component={Paper} sx={{ marginTop: 2 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Product</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Price</TableCell>
                  <TableCell>Quantity</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {editableOrder.productNames.map((product, index) => (
                  <TableRow key={index}>
                    <TableCell>{product}</TableCell>
                    <TableCell>
                      {editableOrder.productDescriptions[index]}
                    </TableCell>
                    <TableCell>
                      {priceFormatter.format(
                        editableOrder.productPrices[index]
                      )}
                    </TableCell>
                    <TableCell>{editableOrder.quantities[index]}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <FormControl fullWidth margin="normal" sx={{ marginTop: 2 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={editableOrder.status}
              name="status"
              onChange={handleChangeStatus}
              label="Status"
            >
              {Object.values(ORDER_STATUS).map((status) => (
                <MenuItem key={status} value={status}>
                  {status}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Stack spacing={2} direction="row" sx={{ marginTop: 2 }}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSaveStatus}
            >
              Save
            </Button>
            <Button
              variant="outlined"
              color="primary"
              onClick={closeOrderDetail}
            >
              Close
            </Button>
          </Stack>
        </>
      ) : (
        <></>
      )}
    </Box>
  );
};

const OrderViewport = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    getAllOrders(
      (orders) => {
        setOrders(orders);
      },
      (error) => {
        console.log(">>>error get all orders: ", error);
      }
    );
  }, []);

  const handleSelectOrder = (order) => {
    setSelectedOrder(order);
  };

  const closeOrderDetail = () => {
    setSelectedOrder(null);
  };

  const handleUpdateOrder = async (updatedOrder) => {
    updateOrder(
      updatedOrder,
      (updatedOrderFromDb) => {
        setSelectedOrder(updatedOrderFromDb);
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order.id === updatedOrderFromDb.id ? updatedOrderFromDb : order
          )
        );
      },
      (error) => {
        console.error("Failed to update order:", error);
        // Handle error appropriately, maybe show a notification to the user
      }
    );
  };

  return (
    <ThemeProvider theme={violet_theme}>
      <Container>
        <Grid container spacing={2}>
          <Grid item xs={selectedOrder ? 7 : 12}>
            <OrderTable orders={orders} onSelectOrder={handleSelectOrder} />
          </Grid>
          <Grid item xs={5} display={selectedOrder ? "flex" : "none"}>
            <OrderDetail
              order={selectedOrder}
              onUpdateOrder={handleUpdateOrder}
              closeOrderDetail={closeOrderDetail}
            />
          </Grid>
        </Grid>
      </Container>
    </ThemeProvider>
  );
};

export default function OrderManagementPage() {
  return <Dashboard selectedIndex={2} childComponent={OrderViewport} />;
}

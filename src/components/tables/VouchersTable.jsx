import { Box, Button, ThemeProvider, Typography } from "@mui/material";
import * as React from "react";
import { violet_theme } from "../../theme/AppThemes";
import { useState } from "react";
import { useEffect } from "react";
import { VOUCHER_COLLECTION, getAllVouchers } from "../../db/dbVoucher";
import MUIDataTable from "mui-datatables";
import { Edit } from "@mui/icons-material";
import { onSnapshot } from "firebase/firestore";
import { max } from "moment";
import { current } from "@reduxjs/toolkit";
import { priceFormatter } from "../../utils/stringHelper";

export default function VouchersTable({ onEditVoucher = null }) {
  const [vouchers, setVouchers] = useState([]);

  const getDataForTable = (vouchers) => {
    let data = [];
    vouchers.forEach((voucher) => {
      data.push({
        id: voucher.id,
        name: voucher.name,
        code: voucher.code,
        discount: voucher.discountRate * 100 + "%",
        maxDiscount: priceFormatter.format(voucher.maxDiscount),
        maxUse: voucher.maxUse,
        currentUse: voucher.currentUse,
        startDate: voucher.startTime,
        endDate: voucher.endTime,
        Actions: voucher.id,
      });
    });
    return data;
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
      name: "code",
      label: "Code",
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: "discount",
      label: "Discount",
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
      name: "maxUse",
      label: "Max Use",
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: "currentUse",
      label: "Current Use",
      options: {
        filter: true,
        sort: true,
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
            <Button
              variant="contained"
              color="primary"
              size="small"
              startIcon={<Edit />}
              onClick={() => {
                console.log("Edit voucher " + value);
                if (onEditVoucher) {
                  onEditVoucher(value);
                } else {
                  console.error("onEditVoucher is null");
                }
              }}
            >
              Edit
            </Button>
          );
        },
      },
    },
  ];

  const options = {
    filter: true,
    filterType: "dropdown",
    responsive: "standard",
    storageKey: "vouchersDataTable",
    resizableColumns: true,
    selectableRows: "single",
  };

  useEffect(() => {
    const unsubscribe = onSnapshot(VOUCHER_COLLECTION, (snapshot) => {
      const vouchers = [];
      snapshot.forEach((doc) => {
        vouchers.push(doc.data());
      });
      setVouchers(vouchers);
    });

    return unsubscribe;
  }, []);

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
          Vouchers table
        </Typography>

        <MUIDataTable
          title={"Vouchers"}
          data={getDataForTable(vouchers)}
          columns={columns}
          options={options}
        />
      </Box>
    </ThemeProvider>
  );
}

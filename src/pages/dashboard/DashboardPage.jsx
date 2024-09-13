import * as React from "react";

import Dashboard from "../components/dashboard/Dashboard";
import { Box, Paper, ThemeProvider, Typography } from "@mui/material";
import { violet_theme } from "../../theme/AppThemes";
import { useDispatch, useSelector } from "react-redux";
import UnauthorizedPage from "../../components/UnauthorizedEntryPage";
import { useEffect } from "react";
import { getAllProducts } from "../../store/actions/productsAction";
import ChipWithTitleV2 from "../../components/miscellaneous/ChipWithTitleVer2";
import WarehouseIcon from "@mui/icons-material/Warehouse";
import ChipWithTitle from "../../components/miscellaneous/ChipWithTitle";
import { getAllProducers } from "../../db/dbProducer";
import { useSnackbarUtils } from "../../utils/useSnackbarUtils";
import ApartmentIcon from "@mui/icons-material/Apartment";
import { getAllUsersFromFirebase } from "../../db/dbUser";
import GroupIcon from "@mui/icons-material/Group";
import ProducersShowcase from "../../components/producers/ProducersShowcase";
import ProductsByProducerPieChart from "../../components/charts/ProductsByProducerPieChart";
import { ThisMonth } from "../../components/charts/ThisMonth";
import { WeeklyRevenue } from "../../components/charts/WeeklyRevenue";
import { DailyTraffic } from "../../components/charts/DailyTraffic";

function ViewPort() {
  const user = useSelector((state) => state.user.user);
  const { products, loading, error } = useSelector((state) => state.products);
  const [producers, setProducers] = React.useState([]);
  const [customers, setCustomers] = React.useState([]);
  const { showSnakbar } = useSnackbarUtils();
  const dispatch = useDispatch();

  useEffect(() => {
    if (products.length === 0) {
      dispatch(getAllProducts());
    }
  }, [products.length]);

  useEffect(() => {
    getAllProducers(
      (producers) => {
        setProducers(producers);
      },
      (error) => {
        console.error("getAllProducers error", error);
        showSnakbar("error" + error, "error", true);
      }
    );
  }, []);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const users = await getAllUsersFromFirebase();
        const customers = [];
        users.forEach((doc) => {
          let e = doc.data();
          e.id = doc.id;
          customers.push(e);
        });
        setCustomers(customers);
      } catch (error) {
        console.error("fetchCustomers error", error);
        showSnakbar("error" + error, "error", true);
      }
    };

    fetchCustomers();
  }, []);

  if (!user) {
    return <UnauthorizedPage />;
  }

  return (
    <ThemeProvider theme={violet_theme}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "start",
          height: "100%",
          width: "100%",
          gap: 2,
        }}
      >
        <Paper elevation={3} sx={{ width: "100%" }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "start",
              alignItems: "start",
              p: 2,
            }}
          >
            <Typography variant="h4" color="primary">
              Dashboard
            </Typography>
            <Typography variant="body1" sx={{ mt: 1 }} fontWeight={"bold"}>
              {"Welcome, " + user.displayName + "!"}
            </Typography>
          </Box>
        </Paper>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "start",
            alignItems: "center",
            width: "100%",
            gap: 2,
          }}
        >
          <Paper elevation={3} sx={{ mt: 2, borderRadius: 5 }}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "start",
                alignItems: "start",
                p: 2,
              }}
            >
              <ChipWithTitle
                title={"Total Products"}
                icon={<WarehouseIcon color="primary" />}
                body={products.length}
              />
            </Box>
          </Paper>

          <Paper elevation={3} sx={{ mt: 2, borderRadius: 5 }}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "start",
                alignItems: "start",
                p: 2,
              }}
            >
              <ChipWithTitle
                title={"Producers"}
                icon={<ApartmentIcon color="primary" />}
                body={producers.length}
              />
            </Box>
          </Paper>

          <Paper elevation={3} sx={{ mt: 2, borderRadius: 5 }}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "start",
                alignItems: "start",
                p: 2,
              }}
            >
              <ChipWithTitle
                title={"Accounts"}
                icon={<GroupIcon color="primary" />}
                body={customers.length}
              />
            </Box>
          </Paper>
        </Box>
        <ProducersShowcase />

        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            gap: 2,
          }}
        >
          <Paper elevation={3} sx={{ borderRadius: 5 }}>
            <ThisMonth />
          </Paper>

          <Paper elevation={3} sx={{ borderRadius: 5 }}>
            <WeeklyRevenue />
          </Paper>
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            gap: 2,
          }}
        >
          <Paper elevation={3} sx={{ borderRadius: 5 }}>
            <DailyTraffic />
          </Paper>

          <Paper elevation={3} sx={{ borderRadius: 5 }}>
            <ProductsByProducerPieChart producerList={producers} />
          </Paper>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default function DashboardPage() {
  return <Dashboard selectedIndex={0} childComponent={ViewPort} />;
}

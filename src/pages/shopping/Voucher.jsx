import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardMedia,
  Button,
  Typography,
  Grid,
  Container,
} from "@mui/material";
import {
  getAllVouchers,
  addNewVoucher,
  updateVoucher,
  getVoucherById,
  applyVoucherCode,
} from "../../db/dbVoucher";
import { ThemeProvider } from "@mui/material/styles";
import { violet_theme } from "../../theme/AppThemes";
import { CardActions } from "@mui/material";
import { addVoucherToFirebase } from "../../store/actions/userAction";
import { useDispatch, useSelector } from "react-redux";

const Voucher = () => {
  const [vouchers, setVouchers] = useState([]);

  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchVouchers = async () => {
      try {
        await getAllVouchers(
          (vouchers) => {
            setVouchers(vouchers);
          },
          (error) => {
            console.error(">>>error fetching vouchers: ", error);
          }
        );
      } catch (error) {
        console.error(">>>error fetching vouchers: ", error);
      }
    };

    fetchVouchers();
  }, []);

  const handleCollect = async (voucherId) => {
    console.log(">>>check click: ", voucherId);
    try {
      dispatch(
        addVoucherToFirebase(
          voucherId,
          (user) => {
            console.log(">>>check add voucher to firebase: ", user);
          },
          (error) => {
            console.log(">>>error add voucher to firebase: ", error);
          }
        )
      );
    } catch (error) {
      console.error("Error collecting voucher: ", error);
    }
  };

  return (
    <ThemeProvider theme={violet_theme}>
      <Container>
        <Grid container spacing={3} sx={{ my: "10px" }}>
          {vouchers.map((voucher) => (
            <Grid item xs={12} sm={6} md={4} key={voucher.id}>
              <Card
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  height: "100%",
                }}
              >
                <CardMedia
                  component="img"
                  height="200"
                  image={voucher.displayImageUrl}
                  alt={voucher.code}
                  sx={{ objectFit: "cover" }}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h5" component="div">
                    {voucher.code}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {voucher.description}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button
                    size="small"
                    variant="contained"
                    color="primary"
                    onClick={() => handleCollect(voucher.id)}
                    disabled={user.collectedVouchers.includes(voucher.id)}
                    sx={{ marginBottom: 2 }}
                  >
                    {user.collectedVouchers.includes(voucher.id)
                      ? "Collected"
                      : "Collect"}
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </ThemeProvider>
  );
};

export default Voucher;

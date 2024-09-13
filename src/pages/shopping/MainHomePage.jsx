import {
  Box,
  Button,
  Grid,
  Tab,
  Tabs,
  Typography,
  Paper,
  MobileStepper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import ProductCard from "../../components/product/ProductCard";
import React, { useState, useEffect } from "react";
import { violet_theme } from "../../theme/AppThemes";
import { ThemeProvider } from "@mui/material/styles";
import { useDispatch, useSelector } from "react-redux";
import { getAllProducts } from "../../store/actions/productsAction";
import ProductsLoading from "../../components/loading/ProductsLoading";
import FilterDialog from "../../components/product/FilterDialog";
import { useNavigate } from "react-router-dom";
import { EVENT_COLLECTION } from "../../db/dbEvent";
import { onSnapshot } from "firebase/firestore";
import SwipeableViews from "react-swipeable-views";
import { autoPlay } from "react-swipeable-views-utils";
import ProducerCard from "../../components/producers/ProducerCard";
import { getAllProducers } from "../../db/dbProducer";
import { useSnackbarUtils } from "../../utils/useSnackbarUtils";
import ProducersShowcase from "../../components/producers/ProducersShowcase";
import { PRODUCT_TYPES } from "../../models/Product";
import { Close } from "@mui/icons-material";

const AutoPlaySwipeableViews = autoPlay(SwipeableViews);

const Banner = ({ images }) => {
  const [activeStep, setActiveStep] = React.useState(0);

  const handleStepChange = (step) => {
    setActiveStep(step);
  };

  return (
    <Box
      sx={{
        width: "100%",
        maxHeight: { md: "450px", lg: "600px", xl: "800px" },
        flexGrow: 1,
      }}
    >
      <AutoPlaySwipeableViews
        index={activeStep}
        onChangeIndex={handleStepChange}
        enableMouseEvents
      >
        {images.map((image, index) => (
          <div key={index}>
            {Math.abs(activeStep - index) <= 2 ? (
              <Box
                component="img"
                sx={{
                  display: "block",
                  overflow: "hidden",
                  width: "100%",
                  height: { md: "450px", lg: "600px", xl: "800px" },
                }}
                src={image}
                alt={"Event Sale off"}
              />
            ) : null}
          </div>
        ))}
      </AutoPlaySwipeableViews>
    </Box>
  );
};

export default function MainHomePage() {
  const [tab, setTab] = useState("new");
  const [events, setEvents] = useState([]);
  const [producers, setProducers] = useState([]);
  const { showSnackbar } = useSnackbarUtils();
  const [showPopup, setShowPopup] = useState(false);

  const [filters, setFilters] = useState({
    price: [],
    brand: [],
    storage: [],
    ram: [],
    screenSize: [],
    charging: [],
  });
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector((state) => state.products);

  const navigate = useNavigate();

  useEffect(() => {
    if (products.length === 0) {
      dispatch(getAllProducts());
    }
  }, [products.length]);

  useEffect(() => {
    const unsubscribe = onSnapshot(EVENT_COLLECTION, (snapshot) => {
      const events = [];
      snapshot.forEach((doc) => {
        let e = doc.data();
        if (e.isExclusive) {
          events.push(e);
        }
      });
      setEvents(events);
      getAllProducers(
        (producers) => {
          setProducers(producers);
        },
        (error) => showSnackbar("Error fetching producers", "error", true)
      );
    });

    return unsubscribe;
  }, []);

  console.log(events);
  const handleFilterApply = (newFilters) => {
    setFilters(newFilters);
  };

  const filteredProducts = products.filter((product) => {
    const brandMatches =
      filters.brand.length === 0 ||
      filters.brand
        .map((b) => b.toLowerCase())
        .includes(product.manufacturer.toLowerCase());

    const storageMatches =
      filters.storage.length === 0 ||
      product.variantStorage.some((storage) =>
        filters.storage.some((fil) => fil == storage)
      );

    const memoryMatches =
      filters.ram.length === 0 ||
      product.variantMemory.some((ram) =>
        filters.ram.some((fil) => fil == ram)
      );

    const screenSizeMatches =
      filters.screenSize.length === 0 ||
      filters.screenSize.some(
        (fil) =>
          fil[0] <= product.screenSize &&
          (fil[1] === -1 || product.screenSize <= fil[1])
      );

    const priceMatches =
      filters.price.length === 0 ||
      product.finalPrices.some((price) =>
        filters.price.some(
          (fil) => fil[0] <= price && (fil[1] === -1 || price <= fil[1])
        )
      );

    const chargingMatches =
      filters.charging.length === 0 ||
      (filters.charging === "Sạc không dây" &&
        product.chargerTech.toLowerCase().includes("sạc không dây")) ||
      (filters.charging === "Sạc nhanh (Từ 18W)" &&
        product.chargerTech
          .match(/(\d+(\.\d+)?)/g)
          .map(Number)
          .some((w) => w >= 18 && w < 45)) ||
      (filters.charging === "Sạc siêu nhanh (Từ 45W)" &&
        product.chargerTech
          .match(/(\d+(\.\d+)?)/g)
          .map(Number)
          .some((w) => w >= 45));

    return (
      brandMatches &&
      storageMatches &&
      memoryMatches &&
      screenSizeMatches &&
      priceMatches &&
      chargingMatches
    );
  });

  filteredProducts.sort((a, b) => {
    switch (tab) {
      case "new":
        return new Date(b.publishedAt) - new Date(a.publishedAt);
      case "hot":
        return b.likeCount - a.likeCount;
      case "priceLowest":
        return a.finalPrices[0] - b.finalPrices[0];
      case "priceHighest":
        return (
          b.finalPrices[b.finalPrices.length - 1] -
          a.finalPrices[a.finalPrices.length - 1]
        );
      default:
        return 0;
    }
  });

  const handleChangeTab = (event, newTab) => {
    setTab(newTab);
  };
  const displayedProducts = filteredProducts
    .slice(0, 16)
    .filter((p) => p.productType === PRODUCT_TYPES.PHONE);

  useEffect(() => {
    const firstVisit = localStorage.getItem("firstVisit");
    if (!firstVisit || firstVisit === "false") {
      setShowPopup(true);
      localStorage.setItem("firstVisit", true);
    }
  }, []);
  const saleProducts = 
    products
      .filter((product) => product.activeEvent !== null || product.activeEvent !== "")
      .slice(0, 4);

  return (
    <ThemeProvider theme={violet_theme}>
      {showPopup && (
        <Dialog
          open={showPopup}
          onClose={() => setShowPopup(false)}
          PaperProps={{
            style: {
              backgroundColor: "transparent",
              boxShadow: "none",
              maxHeight: "80vh", // 80% of viewport height
              maxWidth: "50vw",
              position: "relative",
            },
          }}
          sx={{ overflow: "hidden" }}
        >
          <Typography
            variant="h5"
            sx={{ padding: 2, fontFamily: "Dancing Script, cursive" }}
            color={"primary"}
          >
            New events! Check them out!
          </Typography>
          <DialogContent
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "transparent",
              overflow: "hidden",
            }}
          >
            <Box
              sx={{
                width: "80vh",
                height: "30vw",
                margin: 1,
                boxShadow: "0 5px 15px rgba(0,0,0,0.5)",
                alignContent: "center",
                backgroundColor: "transparent",
                overflow: "hidden",
              }}
              overflow="hidden"
              borderRadius={5}
            >
              {events.length > 0 && <Banner images={events[0].imageUrls} />}
            </Box>
          </DialogContent>

          <IconButton
            aria-label="close"
            onClick={() => setShowPopup(false)}
            sx={{
              position: "absolute", // Position the button absolutely
              right: 8, // 8px from the right
              top: 8, // 8px from the top
            }}
          >
            <Close />
          </IconButton>
        </Dialog>
      )}
      {/* Banner on home page */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          maxHeight: { md: "450px", lg: "600px", xl: "800px" },
        }}
      >
        <Box
          sx={{
            width: { xs: "100%", sm: "100%", md: "70%" },
            height: "100%",
            margin: 1,
            boxShadow: "0 5px 15px rgba(0,0,0,0.5)",
          }}
          overflow="hidden"
          borderRadius={5}
        >
          {events.length > 0 && <Banner images={[...events[0].imageUrls].sort(() => Math.random() - 0.5)} />}
        </Box>
        <Box
          sx={{
            width: { xs: "0%", sm: "0%", md: "30%" },
            height: { md: "450px", lg: "600px", xl: "800px" },
            justifyContent: "center",
            alignItems: "center",
            gap: 1,
          }}
        >
          <Box
            sx={{
              height: "70%",
              marginBottom: 1,
              boxShadow: "0 5px 15px rgba(0,0,0,0.5)",
            }}
            overflow="hidden"
            borderRadius={3}
          >
            {events.length > 0 && (
              <img
                src={events[0].displayImageUrl}
                alt="display banner"
                style={{ width: "100%", height: "100%" }}
              />
            )}
          </Box>
          <Box
            sx={{ height: "28%", boxShadow: "0 5px 15px rgba(0,0,0,0.5)" }}
            overflow="hidden"
            borderRadius={3}
          >
            {events.length > 0 && (
              <img
                src="https://www.metrofone.co.uk/blog/wp-content/uploads/2020/06/must-have-accessories.jpg"
                alt="display banner"
                style={{ width: "100%", height: "100%" }}
              />
            )}
          </Box>
        </Box>
      </Box>

      {/* Display filter and sort */}
      <Box sx={{ marginX: 2, padding: 3, display: "flex" }}>
        <Tabs value={tab} onChange={handleChangeTab}>
          <FilterDialog onFilterChange={handleFilterApply} />
          <Tab value={"new"} label="Mới nhất" />
          <Tab value={"hot"} label="Bán chạy nhất" />
          <Tab value={"priceLowest"} label="Giá thấp nhất" />
          <Tab value={"priceHighest"} label="Giá cao nhất" />
        </Tabs>
        <Button
          variant="outlined"
          onClick={() => navigate("/shopping/all-products")}
        >
          Xem tất cả
        </Button>
      </Box>

      {/* Producers showcase */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          flexWrap: "wrap",
        }}
      >
        <ProducersShowcase />
      </Box>

      {/* Product sale off 50% */}
      <Box sx={{ marginX: 2, padding: 3 }}>
        <Typography color="primary" variant="h5" sx={{ marginBottom: 2 }}>
          Giảm giá
        </Typography>
        {loading && <ProductsLoading />}
        {!loading && !error && (
          <Grid container spacing={3}>
            {filteredProducts
              .filter((p) => p.activeEvent !== "")
              .slice(0, 4)
              .map((product) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
                  <ProductCard product={product} />
                </Grid>
              ))}
          </Grid>
        )}
      </Box>

      {/* Display products */}
      <Box sx={{ marginX: 2, padding: 3 }}>
        <Typography color="primary" variant="h5" sx={{ marginBottom: 2 }}>
          Nổi bật
        </Typography>
        {loading && <ProductsLoading />}
        {!loading && !error && (
          <Grid container spacing={3}>
            {displayedProducts.map((product) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
                <ProductCard product={product} />
              </Grid>
            ))}
          </Grid>
        )}
      </Box>

      {/* Product sale off 50% */}
      <Box sx={{ marginX: 2, padding: 3 }}>
        <Typography color="primary" variant="h5" sx={{ marginBottom: 2 }}>
          Phụ kiện
        </Typography>
        {loading && <ProductsLoading />}
        {!loading && !error && (
          <Grid container spacing={3}>
            {filteredProducts
              .filter((p) => p.productType === PRODUCT_TYPES.ACCESSORY)
              .slice(0, 4)
              .map((product) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
                  <ProductCard product={product} />
                </Grid>
              ))}
          </Grid>
        )}
      </Box>
    </ThemeProvider>
  );
}

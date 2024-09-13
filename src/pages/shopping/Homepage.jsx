import { Box, Grid, Typography } from "@mui/material";
import FilterPanel from "../../components/product/FilterPanel";
import ProductCard from "../../components/product/ProductCard";
// import PaginationComponent from "../components/Pagination";
import React, { useState, useEffect } from "react";
import { useSnackbarUtils } from "../../utils/useSnackbarUtils";
import { violet_theme } from "../../theme/AppThemes";
import { ThemeProvider } from "@mui/material/styles";
import { useDispatch, useSelector } from "react-redux";
import { getAllProducts } from "../../store/actions/productsAction";
import ProductsLoading from "../../components/loading/ProductsLoading";
import { useLocation } from "react-router-dom";
import PaginationComponent from "../../components/miscellaneous/PaginationComponent";

export default function HomePage() {
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({
    brands: [],
    memories: [],
    screenSizes: [],
    priceRange: [2000000, 50000000],
  });
  const { showSnackbar } = useSnackbarUtils();
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector((state) => state.products);
  const location = useLocation();

  useEffect(() => {
    if (products.length === 0) {
      dispatch(getAllProducts());
    }
  }, [products.length]);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setPage(1); // Reset to first page whenever filters change
  };

  const searchParams = new URLSearchParams(location.search);
  const searchQuery = searchParams.get("search") || "";

  const filteredProducts = products.filter((product) => {
    const brandMatches =
      filters.brands.length === 0 ||
      filters.brands
        .map((b) => b.toLowerCase())
        .includes(product.manufacturer.toLowerCase());
    const memoryMatches =
      filters.memories.length === 0 ||
      product.variantStorage.some((storage, index) =>
        filters.memories.includes(
          `${storage}${product.variantStorageDataUnit[index]}`
        )
      );
    const screenSizeMatches =
      filters.screenSizes.length === 0 ||
      (filters.screenSizes.includes("Trên 6 inch") && product.screenSize > 6) ||
      (filters.screenSizes.includes("Dưới 6 inch") && product.screenSize <= 6);
    const priceMatches = product.finalPrices.some(
      (price) =>
        price >= filters.priceRange[0] && price <= filters.priceRange[1]
    );
    const searchMatches = searchQuery
      ? product.name.toLowerCase().includes(searchQuery.toLowerCase())
      : true;

    return (
      brandMatches &&
      memoryMatches &&
      screenSizeMatches &&
      priceMatches &&
      searchMatches
    );
  });

  const productsPerPage = 8;
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const handleChangePage = (event, value) => {
    setPage(value);
  };

  const displayedProducts = filteredProducts.slice(
    (page - 1) * productsPerPage,
    page * productsPerPage
  );

  useEffect(() => {
    console.log(">>>check filtered products: ", filteredProducts);
    console.log(">>>check displayed products: ", displayedProducts);
  }, [filteredProducts, displayedProducts]);

  return (
    <ThemeProvider theme={violet_theme}>
      <Box sx={{ display: "flex", padding: 3 }}>
        <Box sx={{ width: "20%", marginRight: 3 }}>
          <FilterPanel onFilterChange={handleFilterChange} />
        </Box>
        <Box sx={{ width: "80%" }} flexWrap={"wrap"}>
          {loading && <ProductsLoading />}
          {!loading && !error && filteredProducts.length > 0 && (
            <Grid container spacing={3}>
              {displayedProducts.map((product, index) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
                  <ProductCard product={product} />
                </Grid>
              ))}
            </Grid>
          )}
          {!loading && !error && filteredProducts.length === 0 && (
            <Typography>No products found</Typography>
          )}
          <PaginationComponent
            page={page}
            count={totalPages}
            onChange={handleChangePage}
          />
        </Box>
      </Box>
    </ThemeProvider>
  );
}

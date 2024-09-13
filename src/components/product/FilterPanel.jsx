import React, { useState } from "react";
import {
  Box,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Slider,
  Typography,
  ListItemButton,
  Collapse,
  TextField,
} from "@mui/material";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import { priceFormatter } from "../../utils/stringHelper";

const FilterPanel = ({ onFilterChange }) => {
  const [openBrand, setOpenBrand] = useState(false);
  const [openMemory, setOpenMemory] = useState(false);
  const [openScreenSize, setOpenScreenSize] = useState(false);

  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedMemories, setSelectedMemories] = useState([]);
  const [selectedScreenSizes, setSelectedScreenSizes] = useState([]);
  const [priceRange, setPriceRange] = useState([2000000, 50000000]);

  const handleBrandClick = () => {
    setOpenBrand(!openBrand);
  };

  const handleMemoryClick = () => {
    setOpenMemory(!openMemory);
  };

  const handleScreenSizeClick = () => {
    setOpenScreenSize(!openScreenSize);
  };

  const handleFilterChange = (type, value, checked) => {
    let newSelectedFilters;
    if (type === "brands") {
      newSelectedFilters = checked
        ? [...selectedBrands, value]
        : selectedBrands.filter((item) => item !== value);
      setSelectedBrands(newSelectedFilters);
    } else if (type === "memories") {
      newSelectedFilters = checked
        ? [...selectedMemories, value]
        : selectedMemories.filter((item) => item !== value);
      setSelectedMemories(newSelectedFilters);
    } else if (type === "screenSizes") {
      newSelectedFilters = checked
        ? [...selectedScreenSizes, value]
        : selectedScreenSizes.filter((item) => item !== value);
      setSelectedScreenSizes(newSelectedFilters);
    }
    onFilterChange({
      brands: type === "brands" ? newSelectedFilters : selectedBrands,
      memories: type === "memories" ? newSelectedFilters : selectedMemories,
      screenSizes:
        type === "screenSizes" ? newSelectedFilters : selectedScreenSizes,
      priceRange,
    });
  };

  const handlePriceChange = (event, newValue) => {
    setPriceRange(newValue);
    onFilterChange({
      brands: selectedBrands,
      memories: selectedMemories,
      screenSizes: selectedScreenSizes,
      priceRange: newValue,
    });
  };

  const handlePriceInputChange = (event) => {
    const { name, value } = event.target;
    const newRange = [...priceRange];
    newRange[name === "min" ? 0 : 1] = value
      ? parseInt(value.replace(/\D/g, ""), 10)
      : "";
    setPriceRange(newRange);
    onFilterChange({
      brands: selectedBrands,
      memories: selectedMemories,
      screenSizes: selectedScreenSizes,
      priceRange: newRange,
    });
  };

  const brands = [
    "Apple",
    "Samsung",
    "Xiaomi",
    "Poco",
    "OPPO",
    "Honor",
    "Motorola",
    "Nokia",
    "Realme",
  ];

  const memories = ["16GB", "32GB", "64GB", "128GB", "256GB", "512GB", "1TB"];

  const screenSizes = ["Trên 6 inch", "Dưới 6 inch"];

  return (
    <Box sx={{ padding: 2 }}>
      {/* Price Filter */}
      <Typography variant="h6">Giá</Typography>
      <Box sx={{ display: "flex", alignItems: "center", marginBottom: 2 }}>
        <TextField
          label="Từ"
          type="text"
          name="min"
          value={priceFormatter.format(priceRange[0])}
          onChange={handlePriceInputChange}
          variant="outlined"
          size="small"
          sx={{ marginRight: 1 }}
        />
        <TextField
          label="Đến"
          type="text"
          name="max"
          value={priceFormatter.format(priceRange[1])}
          onChange={handlePriceInputChange}
          variant="outlined"
          size="small"
          sx={{ marginLeft: 1 }}
        />
      </Box>
      <Slider
        value={priceRange}
        min={2000000}
        max={50000000}
        step={100000}
        onChange={handlePriceChange}
        valueLabelDisplay="auto"
        sx={{ marginBottom: 2 }}
      />

      {/* Brand Filter */}
      <ListItemButton onClick={handleBrandClick}>
        <Typography variant="h6">Nhãn hiệu</Typography>
        {openBrand ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>
      <Collapse in={openBrand} timeout="auto" unmountOnExit>
        <FormGroup sx={{ marginLeft: 2 }}>
          {brands.map((brand) => (
            <FormControlLabel
              key={brand}
              control={
                <Checkbox
                  checked={selectedBrands.includes(brand)}
                  onChange={(e) =>
                    handleFilterChange("brands", brand, e.target.checked)
                  }
                  value={brand}
                />
              }
              label={brand}
            />
          ))}
        </FormGroup>
      </Collapse>

      {/* Memory Filter */}
      <ListItemButton onClick={handleMemoryClick}>
        <Typography variant="h6">Bộ nhớ</Typography>
        {openMemory ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>
      <Collapse in={openMemory} timeout="auto" unmountOnExit>
        <FormGroup sx={{ marginLeft: 2 }}>
          {memories.map((memory) => (
            <FormControlLabel
              key={memory}
              control={
                <Checkbox
                  checked={selectedMemories.includes(memory)}
                  onChange={(e) =>
                    handleFilterChange("memories", memory, e.target.checked)
                  }
                  value={memory}
                />
              }
              label={memory}
            />
          ))}
        </FormGroup>
      </Collapse>

      {/* Screen Size Filter */}
      <ListItemButton onClick={handleScreenSizeClick}>
        <Typography variant="h6">Màn hình</Typography>
        {openScreenSize ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>
      <Collapse in={openScreenSize} timeout="auto" unmountOnExit>
        <FormGroup sx={{ marginLeft: 2 }}>
          {screenSizes.map((size) => (
            <FormControlLabel
              key={size}
              control={
                <Checkbox
                  checked={selectedScreenSizes.includes(size)}
                  onChange={(e) =>
                    handleFilterChange("screenSizes", size, e.target.checked)
                  }
                  value={size}
                />
              }
              label={size}
            />
          ))}
        </FormGroup>
      </Collapse>
    </Box>
  );
};

export default FilterPanel;

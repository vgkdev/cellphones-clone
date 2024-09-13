import { Box, Button, Chip, Menu } from "@mui/material";
import * as React from "react";
import FilterAltIcon from '@mui/icons-material/FilterAlt';

export default function FilterDialog({ onFilterChange }) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [selectedChips, setSelectedChips] = React.useState(new Set());

  //data
  const menuFilterData = [
    {
      id: 0,
      name: "Giá",
      key: "price",
      element: [
        { name: 'Dưới 5 triệu', value: [0, 5000000] }, 
        { name: '5 triệu - 10 triệu', value: [5000000, 10000000] }, 
        { name: '10 triệu - 20 triệu', value: [10000000, 20000000] }, 
        { name: '20 triệu - 30 triệu', value: [20000000, 30000000] }, 
        { name: 'Trên 30 triệu', value: [30000000, -1] }
      ]
    },
    {
      id: 1,
      name: "Thương hiệu",
      key: "brand",
      element: [
        { name: 'Apple', value: 'Apple' },
        { name: 'Samsung', value: 'Samsung' },
        { name: 'Xiaomi', value: 'Xiaomi' },
        { name: 'Oppo', value: 'Oppo' },
        { name: 'Vivo', value: 'Vivo' }
      ]
    },
    {
      id: 2,
      name: "Dung lượng lưu trữ",
      key: "storage",
      element: [
        {name: '32GB', value: 32 },
        {name: '64GB', value: 64 },
        {name: '128GB', value: 128 },
        {name: '256GB', value: 256 },
        {name: '512GB', value: 512 },
        {name: '1TB', value: 1024 }
      ]
    },
    {
      id: 3,
      name: "Dung lượng Ram",
      key: "ram",
      element: [
        { name: '2GB', value: 2 },
        { name: '3GB', value: 3 },
        { name: '4GB', value: 4 },
        { name: '6GB', value: 6 },
        { name: '8GB', value: 8 },
        { name: '12GB', value: 12 },
        { name: '16GB', value: 16 }
      ]
    },
    {
      id: 4,
      name: "Kích thước màn hình",
      key: "screenSize",
      element: [
        { name: 'Dưới 5 inch', value: [0, 5] }, 
        { name: '5 inch - 6 inch', value: [5, 6] }, 
        { name: '6 inch - 7 inch', value: [6, 7] }, 
        { name: 'Trên 7 inch', value: [7, -1] }
      ]
    },
    {
      id: 5,
      name: "Tính năng sạc",
      key: "charging",
      element: [
        { name: 'Sạc nhanh (Từ 18W)', value: 18 },
        { name: 'Sạc siêu nhanh (Từ 45W)', value: 45 },
        { name: 'Sạc không dây', value: 'Sạc không dây' }
      ]
    },
  ]

  //flag
  const isFilterOpen = Boolean(anchorEl);

  //handdle
  const handleMenuFilterOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuFilterClose = () => {
    setAnchorEl(null);
  }

  const handleChipClick = (itemId, elementIndex, elementValue) => {
    setSelectedChips((prevSelectedChips) => {
      const updatedChips = new Set(prevSelectedChips);
      const chipKey = `${itemId}-${elementIndex}-${elementValue}`;
  
      if (updatedChips.has(chipKey)) {
        updatedChips.delete(chipKey);
      } else {
        updatedChips.add(chipKey);
      }
  
      return updatedChips;
    });
  };
  const handdleApplyFilter = () => {
    var selectedFilters = {
      price: [],
      brand: [],
      storage: [],
      ram: [],
      screenSize: [],
      charging: []
    };
    selectedChips.forEach((chipKey) => {
      const [itemId, elementIndex, elementValue] = chipKey.split("-");
      const key = menuFilterData[itemId].key;
      selectedFilters[key].push(menuFilterData[itemId].element[elementIndex].value);
    });
    console.log(selectedFilters);
    onFilterChange(selectedFilters);
    handleMenuFilterClose();
  }

  const menuFilterId = 'primary-search-account-menu';
  const renderMenuFilter = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      id={menuFilterId}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={isFilterOpen}
      onClose={handleMenuFilterClose}
    >
      {menuFilterData.map((item) => {
        return (
          <Box key={item.id}
            sx={{
              // display: "flex",
              // flexDirection: "column",
              padding: "10px"
            }}
          >
            <div>
              <b>{item.name}</b>
            </div>

            {item.element.map((e, eIndex) => {
              const chipKey = `${item.id}-${eIndex}-${e.value}`;
              const isChipSelected = selectedChips.has(chipKey);
              return (
                <Chip 
                  key={`${item.id}-${eIndex}-${e.value}`}
                  variant="outlined" 
                  label={e.name}
                  color={isChipSelected ? "primary" : "default"} 
                  onClick={() => handleChipClick(item.id, eIndex, e.value)}
                  sx={{ margin: "5px" }}
                />
              )
            })}
          </Box>
        )
      })}
      <Button onClick={handdleApplyFilter} >Áp dụng</Button>
    </Menu>
  );

  return (
    <>
      <Button 
        onClick={handleMenuFilterOpen} 
        endIcon={<FilterAltIcon />}
        variant="outlined"
        size="large"
        sx={{
          width: "10%",
          justifyContent: "center",
          marginRight: 2
        }}
      >Lọc</Button>
      {renderMenuFilter}
    </>
  );
}
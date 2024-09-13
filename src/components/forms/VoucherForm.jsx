import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Tab,
  Tabs,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  Typography,
  ThemeProvider,
  Avatar,
} from "@mui/material";
import React, { useState } from "react";
import { Voucher } from "../../models/Voucher";
import { set } from "firebase/database";
import {
  priceFormatter,
  toTruncatedFirstDecimal,
} from "../../utils/stringHelper";
import { violet_theme } from "../../theme/AppThemes";
import {
  addNewVoucher,
  getVoucherById,
  updateVoucher,
} from "../../db/dbVoucher";
import { useSnackbarUtils } from "../../utils/useSnackbarUtils";
import { useEffect } from "react";
import {
  getAllVoucherDefaultIcons,
  setVoucherIconImage,
} from "../../db/storageImage";
import { useDispatch, useSelector } from "react-redux";
import { getAllProducts } from "../../store/actions/productsAction";

export default function VoucherForm({ voucherId = "", resetForm }) {
  const [voucher, setVoucher] = useState(new Voucher().data());
  const [activeImgTab, setActiveTab] = useState(0);
  const [activeIconImgTab, setActiveIconTab] = useState(0);
  const { showSnackbar } = useSnackbarUtils();
  const [defaultIconUrls, setDefaultIconUrls] = useState([]);
  const { products, loading, error } = useSelector((state) => state.products);
  const dispatch = useDispatch();

  const handleInputChange = (e) => {
    setVoucher((prevVoucher) => ({
      ...prevVoucher,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    console.log("Voucher submitted");
    console.log(voucher);
    if (voucher.id !== "") {
      updateVoucher(
        voucher,
        (rVoucher) => {
          console.log("Voucher updated successfully", rVoucher);
          showSnackbar("Voucher updated successfully", "success");
          setVoucher({ ...rVoucher });
        },
        (error) => {
          console.error("Voucher update error", error);
          showSnackbar("Voucher update error", "error", true);
        }
      );
    } else {
      addNewVoucher(
        voucher,
        (rVoucher) => {
          console.log("Voucher added successfully", rVoucher);
          showSnackbar("Voucher added successfully", "success");
          setVoucher({ ...rVoucher });
        },
        (error) => {
          console.error("Voucher add error", error);
          showSnackbar("Voucher add error", "error", true);
        }
      );
    }
  };

  const handleIconFileInputChange = (e) => {
    if (e.target.files === null || e.target.files.length === 0) {
      showSnackbar("No file selected", "warning", false, 3000);
      return;
    }

    const file = e.target.files[0];

    setVoucherIconImage(
      voucher.id,
      file,
      (url) => {
        setVoucher((prevVoucher) => ({
          ...prevVoucher,
          iconImageUrl: url,
        }));
      },
      (error) => {
        console.error("Voucher icon image upload error", error);
        showSnackbar("Voucher icon image upload error", "error", true);
      }
    );
  };

  const handleImageFileInputChange = (e) => {
    if (e.target.files === null || e.target.files.length === 0) {
      showSnackbar("No file selected", "warning", false, 3000);
      return;
    }

    const file = e.target.files[0];

    setVoucherIconImage(
      voucher.id,
      file,
      (url) => {
        setVoucher((prevVoucher) => ({
          ...prevVoucher,
          displayImageUrl: url,
        }));
      },
      (error) => {
        console.error("Voucher display image upload error", error);
        showSnackbar("Voucher display image upload error", "error", true);
      }
    );
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleIconTabChange = (event, newValue) => {
    setActiveIconTab(newValue);
  };

  useEffect(() => {
    if (voucherId === "") {
      return;
    }

    getVoucherById(
      voucherId,
      (rVoucher) => {
        setVoucher(rVoucher);
      },
      (error) => {
        console.error("Voucher get error", error);
        showSnackbar("Voucher get error", "error", true);
      }
    );
  }, [voucherId]);

  useEffect(() => {
    getAllVoucherDefaultIcons(
      (urls) => {
        setDefaultIconUrls(urls);
      },
      (error) => {
        console.error("Voucher default icons get error", error);
        showSnackbar("Voucher default icons get error", "error", true);
      }
    );
  }, []);

  useEffect(() => {
    if (products.length === 0) {
      dispatch(getAllProducts());
    }
  }, [products.length]);

  useEffect(() => {
    if (resetForm) {
      setVoucher(new Voucher().data());
    }
  }, [resetForm]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: "10px",
      }}
    >
      {voucher.id !== "" && (
        <TextField name="id" label="ID" value={voucher.id} disabled />
      )}
      <TextField
        name="name"
        label="Name"
        value={voucher.name}
        onChange={handleInputChange}
      />
      <TextField
        name="code"
        label="Code"
        value={voucher.code}
        onChange={handleInputChange}
      />
      <TextField
        name="description"
        label="Description"
        value={voucher.description}
        onChange={handleInputChange}
        multiline
        rows={4}
        placeholder="Nhân dịp ABC, chúng tôi xin gửi tặng bạn mã giảm giá XYZ."
      />
      <FormControlLabel
        control={
          <Checkbox
            checked={!voucher.isExclusive}
            onChange={(e) => {
              setVoucher((prevVoucher) => ({
                ...prevVoucher,
                isExclusive: !prevVoucher.isExclusive,
              }));
            }}
            name="isExclusive"
          />
        }
        label="All Products"
      />
      {voucher.isExclusive && (
        <React.Fragment>
          <InputLabel id="applicableProducts">Selected Products</InputLabel>
          <Select
            labelId="applicableProducts"
            name="applicableProducts"
            id="applicableProducts"
            multiple
            value={voucher.applicableProducts}
            onChange={handleInputChange}
          >
            <MenuItem value={[]}>None</MenuItem>
            {products.map((product) => (
              <MenuItem value={product.id} key={product.id}>
                {product.name}
              </MenuItem>
            ))}
          </Select>
        </React.Fragment>
      )}
      <TextField
        name="discountThreshold"
        label={
          "Discount Threshold - " +
          priceFormatter.format(voucher.discountThreshold) +
          " VND"
        }
        type="number"
        value={voucher.discountThreshold}
        onChange={handleInputChange}
        inputProps={{ min: 0, step: 10000 }}
      />
      <TextField
        name="discountRate"
        label={
          "Discount Rate - " +
          toTruncatedFirstDecimal(voucher.discountRate * 100) +
          "%"
        }
        type="number"
        value={voucher.discountRate}
        onChange={handleInputChange}
        inputProps={{ min: 0, max: 0.99, step: 0.01 }}
      />
      <TextField
        name="maxDiscount"
        label={
          "Max Discount - " +
          priceFormatter.format(voucher.maxDiscount) +
          " VND"
        }
        type="number"
        value={voucher.maxDiscount}
        onChange={handleInputChange}
        inputProps={{ min: 0, step: 5000 }}
      />
      <TextField
        name="maxUse"
        label="Max Use"
        type="number"
        value={voucher.maxUse}
        onChange={handleInputChange}
        inputProps={{ min: 0 }}
      />
      {voucher.id !== "" && (
        <TextField
          name="currentUse"
          label="Current Use"
          type="number"
          value={voucher.currentUse}
          disabled
        />
      )}
      {/* start time and end time (range selection)*/}
      {/* start day */}
      <Typography>Start Time</Typography>
      <TextField
        name="startTime"
        type="datetime-local"
        value={voucher.startTime}
        onChange={handleInputChange}
      />
      {/* end day */}
      <Typography>End Time</Typography>
      <TextField
        name="endTime"
        type="datetime-local"
        value={voucher.endTime}
        onChange={handleInputChange}
      />
      {voucher.id !== "" && (
        <ThemeProvider theme={violet_theme}>
          <Typography>Icon</Typography>
          <Tabs value={activeIconImgTab} onChange={handleIconTabChange}>
            <Tab label="Upload Image File" />
            <Tab label="Input URL" />
            <Tab label="Select Icon" />
          </Tabs>
          {activeIconImgTab === 0 && (
            <input
              type="file"
              name="imageFile"
              onChange={handleIconFileInputChange}
            />
          )}{" "}
          {activeIconImgTab === 1 && (
            <TextField
              name="iconImageUrl"
              label="Display Image URL"
              value={voucher.displayImageUrl}
              onChange={handleInputChange}
            />
          )}
          {activeIconImgTab === 2 && (
            <Select
              value={
                defaultIconUrls.includes(voucher.iconImageUrl)
                  ? voucher.iconImageUrl
                  : ""
              }
              onChange={(e) => {
                setVoucher((prevVoucher) => ({
                  ...prevVoucher,
                  iconImageUrl: e.target.value,
                }));
              }}
            >
              <MenuItem value="">None</MenuItem>
              {defaultIconUrls.map((url) => (
                <MenuItem value={url} key={url}>
                  <Avatar
                    src={url}
                    alt="Icon"
                    style={{ width: "50px", height: "50px" }}
                  />
                </MenuItem>
              ))}
            </Select>
          )}
          <Avatar
            src={voucher.iconImageUrl}
            alt="Icon"
            style={{ width: "100px", height: "100px" }}
          />
          <Typography>Display Image</Typography>
          <Tabs value={activeImgTab} onChange={handleTabChange}>
            <Tab label="Upload Image File" />
            <Tab label="Input URL" />
          </Tabs>
          {activeImgTab === 0 ? (
            <input
              type="file"
              name="imageFile"
              onChange={handleImageFileInputChange}
            />
          ) : (
            <TextField
              name="displayImageUrl"
              label="Display Image URL"
              value={voucher.displayImageUrl}
              onChange={handleInputChange}
            />
          )}
          <img
            src={voucher.displayImageUrl}
            alt="Display"
            style={{ width: "100px", height: "100px" }}
          />
        </ThemeProvider>
      )}
      {/* Add more fields for other properties of the Voucher class */}
      <Box
        style={{ position: "sticky", bottom: 0 }}
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "10px",
          zIndex: 10,
          backgroundColor: "white",
        }}
      >
        {voucher.id !== "" ? (
          <Button
            type="submit"
            onClick={() => {
              handleSubmit();
            }}
          >
            Update Voucher
          </Button>
        ) : (
          <Button
            type="submit"
            onClick={() => {
              handleSubmit();
            }}
          >
            Create Voucher
          </Button>
        )}
      </Box>
    </Box>
  );
}

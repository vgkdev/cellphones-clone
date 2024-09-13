import * as React from "react";
import { useState, useEffect } from "react";
import FormLabel from "@mui/material/FormLabel";
import Grid from "@mui/material/Grid";
import OutlinedInput from "@mui/material/OutlinedInput";
import { styled } from "@mui/system";
import { MenuItem, Select, Typography } from "@mui/material";
import { is } from "immutable";
import {
  getDistrictsByProvinceCode,
  getProvinces,
  getWardsByDistrictCode,
} from "vn-local-plus";
import { makeStyles } from "@mui/styles";

const FormGrid = styled(Grid)(() => ({
  display: "flex",
  flexDirection: "column",
}));

const ITEM_HEIGHT = 48;

export default function AddressForm({ userAddress, onAddressChange }) {
  const [name, setName] = useState(userAddress.name || "");
  const [phoneNumber, setPhoneNumber] = useState(userAddress.phoneNumber || "");
  const [city, setCity] = useState(userAddress.city || "");
  const [district, setDistrict] = useState(userAddress.district || "");
  const [ward, setWard] = useState(userAddress.ward || "");
  const [street, setStreet] = useState(userAddress.street || "");
  const [isFormComplete, setIsFormComplete] = useState(false);
  const [provinceList, setProvinceList] = useState([]);

  useEffect(() => {
    setIsFormComplete(
      name && phoneNumber && city && district && ward && street
    );
    onAddressChange({
      name,
      phoneNumber,
      city,
      district,
      ward,
      street,
      address: `${street}, ${ward}, ${district}, ${city}`,
      isFormComplete,
    });
  }, [name, phoneNumber, city, district, ward, street]);

  useEffect(() => {
    const res = getProvinces();
    setProvinceList(res);
    // debugger;
  }, []);

  if (provinceList.length === 0) return <div>Loading...</div>;

  // debugger;

  return (
    <Grid container spacing={3}>
      <FormGrid item xs={12} md={6}>
        <FormLabel htmlFor="name" required>
          Tên:
        </FormLabel>
        <OutlinedInput
          id="name"
          name="name"
          type="name"
          placeholder="Nhập tên của bạn"
          autoComplete="name"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </FormGrid>
      <FormGrid item xs={12} md={6}>
        <FormLabel htmlFor="phonenumber" required>
          Số điện thoại
        </FormLabel>
        <OutlinedInput
          id="phonenumber"
          name="phonenumber"
          type="phonenumber"
          placeholder="Nhập số điện thoại"
          autoComplete="phonenumber"
          required
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
        />
      </FormGrid>

      <FormGrid item xs={6}>
        <FormLabel htmlFor="city" required>
          Tỉnh/Thành phố
        </FormLabel>
        <Select
          id="city"
          name="city"
          placeholder="VD: tp. Hồ Chí Minh"
          required
          value={city}
          onChange={(e) => {
            setCity(e.target.value);
            setDistrict("");
            setWard("");
          }}
          MenuProps={{
            PaperProps: {
              style: {
                maxHeight: ITEM_HEIGHT * 4.5, // where ITEM_HEIGHT is the height of each MenuItem
                width: "20ch",
              },
            },
          }}
        >
          <MenuItem value={""}>None</MenuItem>
          {provinceList.map((province) => (
            <MenuItem key={province.code + province.name} value={province.name}>
              {province.name}
            </MenuItem>
          ))}
        </Select>
      </FormGrid>
      <FormGrid item xs={6}>
        <FormLabel htmlFor="district" required>
          Quận/Huyện
        </FormLabel>
        <Select
          id="district"
          name="district"
          placeholder="VD: Quận 1"
          required
          value={!city ? "" : district}
          onChange={(e) => {
            setDistrict(e.target.value);
            setWard("");
          }}
          MenuProps={{
            PaperProps: {
              style: {
                maxHeight: ITEM_HEIGHT * 4.5, // where ITEM_HEIGHT is the height of each MenuItem
                width: "20ch",
              },
            },
          }}
        >
          <MenuItem value={""}>None</MenuItem>
          {city &&
            getDistrictsByProvinceCode(
              provinceList.find((p) => p.name === city).code
            ).map((district) => (
              <MenuItem key={district.name} value={district.name}>
                {district.name}
              </MenuItem>
            ))}
        </Select>
      </FormGrid>
      <FormGrid item xs={12}>
        <FormLabel htmlFor="ward" required>
          Phường/Xã
        </FormLabel>
        <Select
          id="ward"
          name="ward"
          placeholder="VD: Phường Bến Thành"
          required
          value={ward}
          onChange={(e) => setWard(e.target.value)}
          MenuProps={{
            PaperProps: {
              style: {
                maxHeight: ITEM_HEIGHT * 4.5, // where ITEM_HEIGHT is the height of each MenuItem
                width: "20ch",
              },
            },
          }}
        >
          <MenuItem value={""}>None</MenuItem>
          {district &&
            getWardsByDistrictCode(
              getDistrictsByProvinceCode(
                provinceList?.find((p) => p.name === city)?.code
              )?.find((d) => d.name === district)?.code
            )?.map((ward) => (
              <MenuItem key={ward.name} value={ward.name}>
                {ward.name}
              </MenuItem>
            ))}
        </Select>
      </FormGrid>
      <FormGrid item xs={12}>
        <FormLabel htmlFor="street">Số nhà và tên đường</FormLabel>
        <OutlinedInput
          id="street"
          name="street"
          type="street"
          placeholder="Số nhà và tên đường. VD: 123 Đường Nguyễn Huệ"
          autoComplete="shipping street"
          required
          value={street}
          onChange={(e) => setStreet(e.target.value)}
        />
      </FormGrid>

      {!isFormComplete && (
        <Typography variant="body2" color="error" gutterBottom>
          * Vui lòng điền đầy đủ thông tin để tiếp tục
        </Typography>
      )}
    </Grid>
  );
}

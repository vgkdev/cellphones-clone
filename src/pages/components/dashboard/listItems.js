import * as React from "react";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import ListSubheader from "@mui/material/ListSubheader";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import PeopleIcon from "@mui/icons-material/People";
import ProductIconOutlined from "../../../assets/svg/ProductIconOutlined.svg";
import { Icon } from "@mui/material";

export function MainListItems() {
  let index = 0;

  return (
    <React.Fragment>
      <ListItemButton data-attrib={(index++).toString()}>
        <ListItemIcon>
          <DashboardIcon />
        </ListItemIcon>
        <ListItemText primary="Dashboard" />
      </ListItemButton>
      <ListItemButton data-attrib={(index++).toString()}>
        <ListItemIcon>
          <Icon >
            <img src={ProductIconOutlined} alt="ProductIconOutlined"/>
          </Icon>        
        </ListItemIcon>
        <ListItemText primary="Products" />
      </ListItemButton>
      <ListItemButton data-attrib={(index++).toString()}>
        <ListItemIcon>
          <ShoppingCartIcon />
        </ListItemIcon>
        <ListItemText primary="Orders" />
      </ListItemButton>
      <ListItemButton data-attrib={(index++).toString()}>
        <ListItemIcon>
          <PeopleIcon />
        </ListItemIcon>
        <ListItemText primary="Customers" />
      </ListItemButton>
    </React.Fragment>
  );
  
}
export const secondaryListItems = (
  <React.Fragment>
    <ListSubheader component="div" inset>
      Temporary
    </ListSubheader>
  </React.Fragment>
);

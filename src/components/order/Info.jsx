import * as React from "react";
import PropTypes from "prop-types";

import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";
import { priceFormatter } from "../../utils/stringHelper";
import { ThemeProvider } from "@mui/material";
import { violet_theme } from "../../theme/AppThemes";

function Info({ totalPrice, order = null }) {
  return (
    <ThemeProvider theme={violet_theme}>
      <Typography variant="subtitle2" color="text.secondary">
        Tổng cộng
      </Typography>
      <Typography variant="h4" gutterBottom>
        {priceFormatter.format(totalPrice)}
      </Typography>
      <List disablePadding>
        {/* {products.map((product) => (
          <ListItem key={product.name} sx={{ py: 1, px: 0 }}>
            <ListItemText
              sx={{ mr: 2}}
              primary={product.name}
              secondary={product.desc}
            />
            <Typography variant="body1" fontWeight="medium">
              {priceFormatter.format(product.price)}
            </Typography>
          </ListItem>
        ))} */}
        {order &&
          order.productNames.map((name, index) => (
            <ListItem key={name} sx={{ py: 1, px: 0 }}>
              <ListItemText
                sx={{ mr: 2 }}
                primary={name}
                secondary={order.productDescriptions[index] + " x" + order.quantities[index]}
              />
              <Typography variant="body1" fontWeight="medium">
                {priceFormatter.format(order.productPrices[index] * order.quantities[index])}
              </Typography>
            </ListItem>
          ))}
      </List>
    </ThemeProvider>
  );
}

Info.propTypes = {
  totalPrice: PropTypes.number.isRequired,
};

export default Info;

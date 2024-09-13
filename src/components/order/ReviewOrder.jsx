import * as React from 'react';

import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { priceFormatter } from '../../utils/stringHelper';

export default function ReviewOrder({order}) {
  return (
    <Stack spacing={2}>
      <List disablePadding>
        <ListItem sx={{ py: 1, px: 0 }}>
          <ListItemText primary="Products" secondary={order.productNames.length + " selected"} />
          <Typography variant="body2">
            {priceFormatter.format(order.totalProductPrice)}
          </Typography>
        </ListItem>
        <ListItem sx={{ py: 1, px: 0 }}>
          <ListItemText primary="Shipping" secondary="Plus taxes" />
          <Typography variant="body2">
            {priceFormatter.format(order.shipFee)}
          </Typography>
        </ListItem>
        <ListItem sx={{ py: 1, px: 0 }}>
          <ListItemText primary="Total" />
          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
            {priceFormatter.format(order.total)}
          </Typography>
        </ListItem>
      </List>
      <Divider />
      <Stack
        direction="column"
        divider={<Divider flexItem />}
        spacing={2}
        sx={{ my: 2 }}
      >
        <div>
          <Typography variant="subtitle2" gutterBottom>
            Thông tin giao hàng
          </Typography>
          <Typography gutterBottom>{order.name}</Typography>
          <Typography gutterBottom>{order.phoneNumber}</Typography>
          <Typography color="text.secondary" gutterBottom>
            {order.address}
          </Typography>
        </div>
      </Stack>
    </Stack>
  );
}
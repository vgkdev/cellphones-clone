import * as React from 'react';
import { Box, Button, Card, CardActions, CardContent, CardMedia, Icon, IconButton, Typography } from '@mui/material';
import { AddShoppingCartOutlined } from '@mui/icons-material';
import { grey } from '@mui/material/colors';

export default function ItemProduct({ product }) {  
  return (
    <Card sx={{ 
      maxWidth: 250,
      padding: 2,
      backgroundColor: "#f5f5f5",
      }}
    >
      <Box align="right">
        <IconButton 
          aria-label="add to cart"
          size="large"
        >
          <AddShoppingCartOutlined color="action" />
        </IconButton>
      </Box>
      <CardMedia
        component="img"
        alt={product.name}
        height="160"
        image={product.imageUrls[0]}
      />
      <CardContent>
        <Typography gutterBottom variant="h6" component="div" align="center">
          {product.name}
        </Typography>
        <Typography variant="h4" color="text.primary" align="center">
          {product.finalPrices[0]}đ
        </Typography>
      </CardContent>
      <CardActions>
        <Box align="center" width="100%">
          <Button
            size="large"
            variant="contained"
            color="primary"
            sx={{ mx: 4}}
            disableRipple
          >
            Mua ngay
          </Button>
        </Box>
      </CardActions>
    </Card>
  );
}
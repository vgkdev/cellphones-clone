import * as React from 'react';

import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardContent from '@mui/material/CardContent';
import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import RadioGroup from '@mui/material/RadioGroup';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import AccountBalanceRoundedIcon from '@mui/icons-material/AccountBalanceRounded';
import CreditCardRoundedIcon from '@mui/icons-material/CreditCardRounded';
import SimCardRoundedIcon from '@mui/icons-material/SimCardRounded';
import WarningRoundedIcon from '@mui/icons-material/WarningRounded';

import { styled } from '@mui/system';

const FormGrid = styled('div')(() => ({
  display: 'flex',
  flexDirection: 'column',
}));

export default function PaymentForm({orderKey}) {
  const bankInfo = {
    bank: 'Vietcombank',
    accountNumber: '123456789',
    contentPayment: orderKey,
  };
  
  return (
    <Stack spacing={{ xs: 3, sm: 6 }} useFlexGap>
      <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
          }}
        >
          <Alert severity="warning" icon={<WarningRoundedIcon />}>
            Đơn đặt hàng của bạn sẽ được xử lý sau khi thanh toán thành công.
          </Alert>
          <Typography variant="subtitle1" fontWeight="medium">
            Tài khoản ngân hàng
          </Typography>
          <Typography variant="body1" gutterBottom>
            Vui lòng chuyển khoản thanh toán vào tài khoản ngân hàng dưới đây.
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Typography variant="body1" color="text.secondary">
              Ngân hàng:
            </Typography>
            <Typography variant="body1" fontWeight="medium">
              {bankInfo.bank}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Typography variant="body1" color="text.secondary">
              Số tài khoản:
            </Typography>
            <Typography variant="body1" fontWeight="medium">
              {bankInfo.accountNumber}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Typography variant="body1" color="text.secondary">
              Nội dung thanh toán:
            </Typography>
            <Typography variant="body1" fontWeight="medium">
              {bankInfo.contentPayment}
            </Typography>
          </Box>
        </Box>
    </Stack>
  );
}
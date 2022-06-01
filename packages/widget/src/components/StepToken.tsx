/* eslint-disable react/no-array-index-key */
import { TokenAmount } from '@lifinance/sdk';
import { Avatar, Box, BoxProps, Typography } from '@mui/material';
import { formatTokenAmount } from '../utils/format';
import { TextFitter } from './TextFitter';

export const StepToken: React.FC<{ token: TokenAmount } & BoxProps> = ({
  token,
  ...other
}) => {
  return (
    <Box flex={1} height={46} {...other}>
      <Box display="flex" flex={1}>
        <Avatar src={token.logoURI} alt={token.symbol} sx={{ marginRight: 2 }}>
          {token.symbol[0]}
        </Avatar>
        <TextFitter
          maxHeight={32}
          textStyle={{
            fontWeight: 700,
          }}
        >
          {formatTokenAmount(token.amount, token.decimals)}
        </TextFitter>
      </Box>
      <Typography
        fontSize={14}
        lineHeight={1}
        fontWeight="500"
        color="text.secondary"
        mr={1}
        ml={6}
      >
        {token.symbol}
      </Typography>
    </Box>
  );
};

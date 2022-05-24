/* eslint-disable react/no-array-index-key */
import { TokenAmount } from '@lifinance/sdk';
import { Avatar, Box, BoxProps, Typography } from '@mui/material';
import { formatTokenAmount } from '../../utils/format';

export const StepToken: React.FC<{ token: TokenAmount } & BoxProps> = ({
  token,
  ...other
}) => {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }} {...other}>
      <Avatar src={token.logoURI} alt={token.symbol} sx={{ marginRight: 2 }}>
        {token.symbol[0]}
      </Avatar>
      <Typography fontSize={24} fontWeight="700" lineHeight={1.333334}>
        {formatTokenAmount(token.amount, token.decimals)}
      </Typography>
      <Typography
        fontSize={14}
        lineHeight={1.8577}
        fontWeight="500"
        alignSelf="flex-end"
        color="text.secondary"
        mx={1}
      >
        {token.symbol}
      </Typography>
    </Box>
  );
};

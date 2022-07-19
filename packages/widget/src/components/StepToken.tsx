/* eslint-disable react/no-array-index-key */
import { TokenAmount } from '@lifi/sdk';
import { Box, BoxProps, Typography } from '@mui/material';
import { formatTokenAmount } from '../utils';
import { TextFitter } from './TextFitter';
import { TokenAvatar } from './TokenAvatar';

export const StepToken: React.FC<{ token: TokenAmount } & BoxProps> = ({
  token,
  ...other
}) => {
  return (
    <Box flex={1} {...other}>
      <Box display="flex" flex={1}>
        <TokenAvatar token={token} sx={{ marginRight: 2 }} />
        <TextFitter
          height={32}
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

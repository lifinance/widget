import { Process } from '@lifinance/sdk';
import { Box, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { CircularProgress } from './CircularProgress';

export const ExecutionItem: React.FC<{
  process: Process;
}> = ({ process }) => {
  const { t } = useTranslation();

  return (
    <Box px={2} py={1} sx={{ display: 'flex', alignItems: 'center' }}>
      <CircularProgress status={process.status} />
      <Typography ml={2}>{process.message}</Typography>
      {/* <Typography
        fontSize={18}
        fontWeight="500"
        alignSelf="flex-end"
        color="text.secondary"
        mx={1}
      >
        {fromToken.symbol}
      </Typography> */}
    </Box>
  );
};

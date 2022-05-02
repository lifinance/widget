import { Process } from '@lifinance/sdk';
import { Box, Link, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { CircularProgress } from './CircularProgress';

export const ExecutionItem: React.FC<{
  process: Process;
}> = ({ process }) => {
  const { t } = useTranslation();

  return (
    <Box px={2} py={1}>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <CircularProgress status={process.status} />
        <Typography ml={2}>{process.message}</Typography>
      </Box>
      {process.txLink ? (
        <Box ml={6}>
          <Link
            href={process.txLink}
            variant="body2"
            underline="none"
            target="_blank"
            rel="nofollow noreferrer"
          >
            {t('swapping.transactionDetails')}
          </Link>
        </Box>
      ) : null}
    </Box>
  );
};

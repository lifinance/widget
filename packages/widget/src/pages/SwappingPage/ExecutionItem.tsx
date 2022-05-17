import { Process, Step } from '@lifinance/sdk';
import { useChains } from '@lifinance/widget/hooks';
import { Box, Link, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { CircularProgress } from './CircularProgress';
import { getProcessMessage } from './utils';

export const ExecutionItem: React.FC<{
  step: Step;
  process: Process;
}> = ({ step, process }) => {
  const { t } = useTranslation();
  const { getChainById } = useChains();
  const { title, message } = getProcessMessage(t, getChainById, step, process);
  return (
    <Box px={2} py={1}>
      <Box
        sx={{
          display: 'flex',
          alignItems: process.error ? 'flex-start' : 'center',
        }}
      >
        <CircularProgress status={process.status} />
        <Box ml={2}>
          <Typography fontWeight={process.error ? 700 : 500}>
            {title}
          </Typography>
          {message ? (
            <Typography fontSize={14} fontWeight={500} color="text.secondary">
              {message}
            </Typography>
          ) : null}
        </Box>
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

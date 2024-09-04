import type { LiFiStep, Process } from '@lifi/sdk';
import { OpenInNewRounded } from '@mui/icons-material';
import { Box, Link, Typography } from '@mui/material';
import { useExplorer } from '../../hooks/useExplorer.js';
import { useProcessMessage } from '../../hooks/useProcessMessage.js';
import { CardIconButton } from '../Card/CardIconButton.js';
import { CircularProgress } from './CircularProgress.js';

export const StepProcess: React.FC<{
  step: LiFiStep;
  process: Process;
}> = ({ step, process }) => {
  const { title, message } = useProcessMessage(step, process);
  const { getTransactionLinkByChainId } = useExplorer();

  return (
    <Box px={2} py={1}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <CircularProgress process={process} />
        <Typography
          mx={2}
          flex={1}
          fontSize={14}
          fontWeight={process.error ? 600 : 400}
        >
          {title}
        </Typography>
        {process.txHash ? (
          <CardIconButton
            size="small"
            LinkComponent={Link}
            href={getTransactionLinkByChainId(
              process.txHash,
              step.action.fromChainId,
            )}
            target="_blank"
            rel="nofollow noreferrer"
          >
            <OpenInNewRounded fontSize="inherit" />
          </CardIconButton>
        ) : null}
      </Box>
      {message ? (
        <Typography
          ml={7}
          fontSize={14}
          fontWeight={500}
          color="text.secondary"
        >
          {message}
        </Typography>
      ) : null}
    </Box>
  );
};

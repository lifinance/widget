import type { LiFiStep, Process } from '@lifi/sdk';
import { LinkRounded } from '@mui/icons-material';
import { Box, Link, Typography } from '@mui/material';
import { useProcessMessage } from '../../hooks/useProcessMessage.js';
import { CircularProgress } from './CircularProgress.js';
import { LinkButton } from './StepProcess.style.js';

export const StepProcess: React.FC<{
  step: LiFiStep;
  process: Process;
}> = ({ step, process }) => {
  const { title, message } = useProcessMessage(step, process);
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
        {process.txLink ? (
          <LinkButton
            size="medium"
            LinkComponent={Link}
            href={process.txLink}
            target="_blank"
            rel="nofollow noreferrer"
          >
            <LinkRounded />
          </LinkButton>
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

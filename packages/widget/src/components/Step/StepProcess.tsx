import type { Process, Step } from '@lifi/sdk';
import { LinkRounded as LinkIcon } from '@mui/icons-material';
import { Box, Link, Typography } from '@mui/material';
import { useProcessMessage } from '../../hooks';
import { CircularProgress } from './CircularProgress';
import { LinkButton } from './StepProcess.style';

export const StepProcess: React.FC<{
  step: Step;
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
        <Typography ml={2} fontSize={14} fontWeight={process.error ? 600 : 400}>
          {title}
        </Typography>
        {process.txLink ? (
          <Box
            ml={2}
            sx={{
              display: 'flex',
              flex: 1,
              justifyContent: 'flex-end',
            }}
          >
            <LinkButton
              size="small"
              edge="end"
              LinkComponent={Link}
              href={process.txLink}
              target="_blank"
              rel="nofollow noreferrer"
            >
              <LinkIcon />
            </LinkButton>
          </Box>
        ) : null}
      </Box>
      {message ? (
        <Typography
          ml={6}
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

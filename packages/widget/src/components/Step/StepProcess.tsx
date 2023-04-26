import type { LifiStep, Process } from '@lifi/sdk';
import LinkRoundedIcon from '@mui/icons-material/LinkRounded';
import { Box, Link, Typography } from '@mui/material';
import { useProcessMessage } from '../../hooks';
import { CircularProgress } from './CircularProgress';
import { LinkButton } from './StepProcess.style';

export const StepProcess: React.FC<{
  step: LifiStep;
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
            size="small"
            edge="end"
            LinkComponent={Link}
            href={process.txLink}
            target="_blank"
            rel="nofollow noreferrer"
          >
            <LinkRoundedIcon />
          </LinkButton>
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

import { Process, Step } from '@lifi/sdk';
import { Link as LinkIcon } from '@mui/icons-material';
import { Box, Link, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useChains } from '../../hooks';
import { CircularProgress } from './CircularProgress';
import { LinkButton } from './ExecutionItem.style';
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
          alignItems: 'center',
        }}
      >
        <CircularProgress status={process.status} />
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
              aria-label="settings"
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

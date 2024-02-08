import type { LiFiStepExtended } from '@lifi/sdk';
import { LinkRounded, Wallet } from '@mui/icons-material';
import { Box, Link, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { CircularIcon } from './CircularProgress.style.js';
import { LinkButton } from './StepProcess.style.js';

export const DestinationWalletAddress: React.FC<{
  step: LiFiStepExtended;
  toAddress: string;
  toAddressLink: string;
}> = ({ step, toAddress, toAddressLink }) => {
  const { t } = useTranslation();
  const isDone = step.execution?.status === 'DONE';
  return (
    <Box px={2} py={1}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <CircularIcon status={isDone ? 'DONE' : 'NOT_STARTED'}>
          <Wallet
            color={isDone ? 'success' : 'inherit'}
            sx={{
              position: 'absolute',
              fontSize: '1.25rem',
            }}
          />
        </CircularIcon>
        <Typography mx={2} flex={1} fontSize={14} fontWeight={400}>
          {isDone
            ? t('main.sentToAddress', {
                address: toAddress,
              })
            : t('main.sendToAddress', {
                address: toAddress,
              })}
        </Typography>
        <LinkButton
          size="medium"
          LinkComponent={Link}
          href={toAddressLink}
          target="_blank"
          rel="nofollow noreferrer"
        >
          <LinkRounded />
        </LinkButton>
      </Box>
    </Box>
  );
};

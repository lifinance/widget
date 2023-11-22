import type { PropsWithChildren } from 'react';
import { Typography } from '@mui/material';
import WarningRoundedIcon from '@mui/icons-material/WarningRounded';
import { SlippageLimitsWarningContainer } from './SlippageSettings.style';

export const SlippageLimitsWarning: React.FC<PropsWithChildren> = ({
  children,
}) => (
  <SlippageLimitsWarningContainer>
    <WarningRoundedIcon color="warning" />
    <Typography fontSize={13} fontWeight={400}>
      {children}
    </Typography>
  </SlippageLimitsWarningContainer>
);

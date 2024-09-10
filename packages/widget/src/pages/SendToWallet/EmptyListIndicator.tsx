import { Typography } from '@mui/material';
import type { PropsWithChildren, ReactNode } from 'react';
import { EmptyContainer, IconContainer } from './SendToWalletPage.style.js';

interface EmptyListIndicatorProps extends PropsWithChildren {
  icon: ReactNode;
}
export const EmptyListIndicator = ({
  icon,
  children,
}: EmptyListIndicatorProps) => (
  <EmptyContainer>
    <IconContainer>{icon}</IconContainer>
    <Typography fontSize={14} fontWeight={700} color="text.secondary">
      {children}
    </Typography>
  </EmptyContainer>
);

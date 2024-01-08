import type { PropsWithChildren, ReactNode } from 'react';
import {
  EmptyContainer,
  EmptyListMessage,
  IconContainer,
} from './SendToWalletPage.style';

interface EmptyListIndicatorProps extends PropsWithChildren {
  icon: ReactNode;
}
export const EmptyListIndicator = ({
  icon,
  children,
}: EmptyListIndicatorProps) => (
  <EmptyContainer>
    <IconContainer>{icon}</IconContainer>
    <EmptyListMessage>{children}</EmptyListMessage>
  </EmptyContainer>
);

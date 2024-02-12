import type { BoxProps } from '@mui/material';
import type { PropsWithChildren, ReactNode } from 'react';
import {
  AlertMessageCard,
  AlertMessageCardTitle,
} from './AlertMessage.style.js';
import type { Severity } from './types.js';

interface AlertMessageProps extends PropsWithChildren<Omit<BoxProps, 'title'>> {
  icon: ReactNode;
  title: ReactNode;
  isMultilineTitle?: boolean;
  severity?: Severity;
}

export const AlertMessage = ({
  title,
  icon,
  children,
  isMultilineTitle,
  severity = 'info',
  ...rest
}: AlertMessageProps) => (
  <AlertMessageCard severity={severity} {...rest}>
    <AlertMessageCardTitle
      severity={severity}
      alignItems={isMultilineTitle ? 'start' : 'center'}
    >
      {icon}
      {title}
    </AlertMessageCardTitle>
    {children}
  </AlertMessageCard>
);

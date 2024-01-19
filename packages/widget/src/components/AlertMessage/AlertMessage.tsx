import { AlertMessageCard, AlertMessageCardTitle } from './AlertMessage.style';
import type { Severity } from './types';
import type { PropsWithChildren, ReactNode } from 'react';
import type { Theme as SystemTheme } from '@mui/system/createTheme/createTheme';
import type { SxProps } from '@mui/system/styleFunctionSx';

interface AlertMessageProps<Theme extends object = SystemTheme>
  extends PropsWithChildren {
  icon: ReactNode;
  title: ReactNode;
  isMultilineTitle?: boolean;
  severity?: Severity;
  sx?: SxProps<Theme>;
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

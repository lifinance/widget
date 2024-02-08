import type { BoxProps } from '@mui/material';
import type { PropsWithChildren } from 'react';
import { Card } from '../Card/Card.js';

export const ContractComponent: React.FC<PropsWithChildren<BoxProps>> = ({
  children,
  ...props
}) => {
  if (!children) {
    return null;
  }

  return <Card {...props}>{children}</Card>;
};

import { Tooltip } from '@mui/material';
import type { ReactElement } from 'react';

export const ButtonTooltip = ({
  title,
  children,
}: {
  title?: string;
  children: JSX.Element;
}) =>
  title ? (
    <Tooltip title={title} placement="top" enterDelay={250} arrow>
      <span>{children as ReactElement<any, any>}</span>
    </Tooltip>
  ) : (
    children
  );

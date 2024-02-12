import type { IconButtonProps, LinkProps } from '@mui/material';
import { IconButton, styled } from '@mui/material';

export const LinkButton = styled(IconButton)<IconButtonProps & LinkProps>(
  ({ theme }) => ({
    padding: theme.spacing(0.5),
  }),
);

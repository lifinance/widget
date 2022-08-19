import type { IconButtonProps, LinkProps } from '@mui/material';
import { IconButton } from '@mui/material';
import { styled } from '@mui/material/styles';

export const LinkButton = styled(IconButton)<IconButtonProps & LinkProps>(
  ({ theme }) => ({
    padding: theme.spacing(0.5),
  }),
);

import type { IconButtonProps, LinkProps } from '@mui/material';
import { styled } from '@mui/material';
import { CardIconButton } from '../Card/CardIconButton.js';

export const LinkButton = styled(CardIconButton)<IconButtonProps & LinkProps>(
  ({ theme }) => ({
    padding: theme.spacing(0.5),
  }),
);

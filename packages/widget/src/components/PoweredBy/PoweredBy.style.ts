import type { StyledComponent } from '@emotion/styled';
import type { LinkProps } from '@mui/material';
import { Link as MuiLink } from '@mui/material';
import { styled } from '@mui/material/styles';

export const Link: StyledComponent<LinkProps> = styled(MuiLink)(
  ({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    border: 'none',
    ':hover': {
      color: theme.palette.primary.main,
    },
  }),
);

import type { CardProps as MuiCardProps } from '@mui/material';
import { alpha, darken, lighten, Card as MuiCard, styled } from '@mui/material';

export interface CardProps extends MuiCardProps {
  type?: 'default' | 'selected' | 'error';
  selectionColor?: 'primary' | 'secondary';
  indented?: boolean;
}

export const Card = styled(MuiCard, {
  shouldForwardProp: (prop) =>
    !['type', 'indented', 'selectionColor'].includes(prop as string),
})<CardProps>(({ theme, indented, selectionColor, type }) => {
  return {
    padding: indented ? theme.spacing(2) : 0,
    ...(type === 'selected' &&
      selectionColor === 'primary' && {
        backgroundColor:
          theme.palette.mode === 'light'
            ? lighten(theme.palette.primary.main, 0.95)
            : darken(theme.palette.primary.main, 0.65),
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: theme.palette.primary.main,
        '&:hover': {
          backgroundColor:
            theme.palette.mode === 'light'
              ? lighten(theme.palette.primary.main, 0.9)
              : darken(theme.palette.primary.main, 0.6),
        },
      }),
    ...(type === 'selected' &&
      selectionColor === 'secondary' && {
        backgroundColor:
          theme.palette.mode === 'light'
            ? lighten(theme.palette.secondary.main, 0.85)
            : darken(theme.palette.secondary.main, 0.76),
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: alpha(theme.palette.secondary.main, 0.2),
        '&:hover': {
          backgroundColor:
            theme.palette.mode === 'light'
              ? lighten(theme.palette.secondary.main, 0.8)
              : darken(theme.palette.secondary.main, 0.72),
        },
      }),
    ...(type === 'error' && {
      borderWidth: 1,
      borderStyle: 'solid',
      borderColor: theme.palette.error.main,
    }),
  };
});

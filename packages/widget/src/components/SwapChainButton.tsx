import { Button } from '@mui/material';
import { buttonClasses } from '@mui/material/Button';
import { alpha, styled } from '@mui/material/styles';

export const SwapChainButton = styled(Button)(({ theme }) => ({
  backgroundColor:
    theme.palette.mode === 'light'
      ? theme.palette.common.white
      : theme.palette.grey[900],
  color: theme.palette.text.primary,
  borderRadius: '8px 8px 0 0',
  borderWidth: '2px 2px 1px 2px',
  borderStyle: 'solid',
  borderColor: theme.palette.grey[300],
  paddingRight: 14,
  textTransform: 'none',
  marginBottom: -1,
  height: '42px',
  [`& .${buttonClasses.endIcon}`]: {
    color: theme.palette.text.secondary,
    flex: 1,
    justifyContent: 'end',
  },
  [`&.${buttonClasses.focusVisible}`]: {
    backgroundColor: `${alpha(theme.palette.primary.main, 0.02)}`,
  },
  '&:hover': {
    backgroundColor:
      theme.palette.mode === 'light'
        ? theme.palette.common.white
        : theme.palette.grey[900],
    borderColor: theme.palette.grey[300],
    borderWidth: '2px 2px 1px 2px',
    boxShadow: 'none',
  },
  '&:focus': {
    boxShadow: `${alpha(theme.palette.primary.main, 0.25)} 0 0 0 0.2rem`,
    backgroundColor: `${alpha(theme.palette.primary.main, 0.25)} 0 0 0 0.2rem`,
    borderColor: theme.palette.primary.main,
    zIndex: 1,
  },
}));

import { ToggleButton as MuiToggleButton } from '@mui/material';
import { styled } from '@mui/material/styles';
import { toggleButtonClasses } from '@mui/material/ToggleButton';

export const ToggleButton = styled(MuiToggleButton)(({ theme }) => ({
  textTransform: 'none',
  borderRadius: theme.shape.borderRadius,
  borderColor:
    theme.palette.mode === 'light'
      ? theme.palette.grey[300]
      : theme.palette.grey[800],
  [`&.${toggleButtonClasses.selected}`]: {
    color:
      theme.palette.mode === 'light'
        ? theme.palette.primary.main
        : theme.palette.primary.light,
    borderColor: 'currentColor !important',
  },
}));

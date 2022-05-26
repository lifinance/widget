import { ToggleButton as MuiToggleButton } from '@mui/material';
import { styled } from '@mui/material/styles';
import { toggleButtonClasses } from '@mui/material/ToggleButton';

export const ToggleButton = styled(MuiToggleButton)(({ theme }) => ({
  textTransform: 'none',
  borderRadius: (theme.shape.borderRadius as number) * 2,
  borderColor:
    theme.palette.mode === 'light'
      ? theme.palette.grey[300]
      : theme.palette.grey[800],
  [`&.${toggleButtonClasses.selected}`]: {
    color: theme.palette.primary.main,
    borderColor: 'currentColor !important',
  },
}));

import {
  Button as MuiButton,
  ButtonGroup as MuiButtonGroup,
} from '@mui/material';
import { buttonClasses } from '@mui/material/Button';
import { buttonGroupClasses } from '@mui/material/ButtonGroup';
import { styled } from '@mui/material/styles';

export const Button = styled(MuiButton)(({ theme }) => ({
  textTransform: 'none',
  borderRadius: 8,
  padding: '7px 21px',
  border: `2px solid rgba(19, 60, 76, 0.12)`,
  [`&.${buttonClasses.outlined}`]: {
    color: theme.palette.text.secondary,
    fontWeight: 400,
  },
  [`&:hover`]: {
    border: 2,
    borderStyle: 'solid',
    borderColor: theme.palette.primary.main,
  },
  [`&.${buttonClasses.outlined}:hover`]: {
    color: theme.palette.primary.main,
    backgroundColor: 'rgb(0 0 0 / 2%)',
    borderColor: 'currentColor',
  },
}));

export const ButtonGroup = styled(MuiButtonGroup)(({ theme }) => ({
  [`& .${buttonGroupClasses.grouped}:not(.${buttonClasses.contained}:last-of-type):hover`]:
    {
      borderRightColor: theme.palette.primary.main,
    },
  [`&  .${buttonGroupClasses.grouped}:not(:first-of-type)`]: {
    marginLeft: '-2px',
  },
}));

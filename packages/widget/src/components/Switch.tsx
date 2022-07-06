import { Switch as MuiSwitch } from '@mui/material';
import { styled } from '@mui/material/styles';
import { switchClasses } from '@mui/material/Switch';

export const Switch = styled(MuiSwitch)(({ theme }) => ({
  width: 42,
  height: 24,
  padding: 0,
  [`.${switchClasses.switchBase}`]: {
    padding: 0,
    margin: theme.spacing(0.25),
    transitionDuration: theme.transitions.duration.standard,
    [`&.${switchClasses.checked}`]: {
      transform: 'translateX(18px)',
      color: theme.palette.common.white,
      [`& + .${switchClasses.track}`]: {
        backgroundColor: theme.palette.primary.main,
        opacity: 1,
        border: 0,
      },
      [`&.${switchClasses.disabled} + .${switchClasses.track}`]: {
        opacity: 0.5,
      },
    },
    [`&.Mui-focusVisible .${switchClasses.thumb}`]: {
      color: theme.palette.primary.main,
      border: '6px solid',
      borderColor: theme.palette.common.white,
    },
    [`&.${switchClasses.disabled} .${switchClasses.thumb}`]: {
      color:
        theme.palette.mode === 'light'
          ? theme.palette.grey[100]
          : theme.palette.grey[600],
    },
    [`&.${switchClasses.disabled} + .${switchClasses.track}`]: {
      opacity: theme.palette.mode === 'light' ? 0.7 : 0.3,
    },
  },
  [`.${switchClasses.thumb}`]: {
    boxSizing: 'border-box',
    width: 20,
    height: 20,
  },
  [`.${switchClasses.track}`]: {
    borderRadius: 24 / 2,
    backgroundColor:
      theme.palette.mode === 'light'
        ? theme.palette.grey[400]
        : theme.palette.grey[800],
    opacity: 1,
    transition: theme.transitions.create(['background-color'], {
      duration: theme.transitions.duration.standard,
    }),
  },
}));

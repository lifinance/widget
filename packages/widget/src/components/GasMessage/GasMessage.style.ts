import { switchClasses } from '@mui/material/Switch';
import { alpha, styled } from '@mui/material/styles';
import { Switch } from '../Switch';

export const InfoMessageSwitch = styled(Switch)(({ theme }) => ({
  [`.${switchClasses.switchBase}`]: {
    [`&.${switchClasses.checked}`]: {
      [`& + .${switchClasses.track}`]: {
        backgroundColor:
          theme.palette.mode === 'light'
            ? theme.palette.info.main
            : alpha(theme.palette.info.main, 0.84),
      },
    },
    [`&.Mui-focusVisible .${switchClasses.thumb}`]: {
      color:
        theme.palette.mode === 'light'
          ? theme.palette.info.main
          : alpha(theme.palette.info.main, 0.84),
    },
  },
}));

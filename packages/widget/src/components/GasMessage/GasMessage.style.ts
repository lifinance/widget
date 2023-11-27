import { Box } from '@mui/material';
import { switchClasses } from '@mui/material/Switch';
import { alpha, darken, lighten, styled } from '@mui/material/styles';
import { Switch } from '../Switch';
import { getInfoBackgroundColor, getWarningBackgroundColor } from '../../utils';

const MessageCard = styled(Box)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  position: 'relative',
  whiteSpace: 'pre-line',
}));

export const WarningMessageCard = styled(MessageCard)(({ theme }) => ({
  backgroundColor: getWarningBackgroundColor(theme),
}));

export const WarningMessageCardTitle = styled(Box)(({ theme }) => ({
  color:
    theme.palette.mode === 'light'
      ? darken(theme.palette.warning.main, 0.36)
      : alpha(theme.palette.warning.main, 1),
}));

export const InfoMessageCard = styled(MessageCard)(({ theme }) => ({
  backgroundColor: getInfoBackgroundColor(theme),
}));

export const InfoMessageCardTitle = styled(Box)(({ theme }) => ({
  color:
    theme.palette.mode === 'light'
      ? theme.palette.info.main
      : lighten(theme.palette.info.main, 0.24),
}));

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

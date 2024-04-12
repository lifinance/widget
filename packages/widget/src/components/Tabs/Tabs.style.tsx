import type { TabProps } from '@mui/material';
import {
  Tab as MuiTab,
  Tabs as MuiTabs,
  alpha,
  styled,
  tabClasses,
  tabsClasses,
} from '@mui/material';
import { getCardFieldsetBackgroundColor } from '../../utils/colors.js';

export const Tabs = styled(MuiTabs)(({ theme }) => ({
  backgroundColor: getCardFieldsetBackgroundColor(theme),
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(0.5),
  flex: 1,
  [`.${tabsClasses.indicator}`]: {
    height: '100%',
    width: '100%',
    backgroundColor: theme.palette.background.paper,
    borderRadius: theme.shape.borderRadius - 4,
    boxShadow: `0px 2px 4px ${alpha(theme.palette.common.black, 0.04)}`,
  },
}));

export const Tab = styled(MuiTab)<TabProps>(({ theme }) => ({
  zIndex: 1,
  flex: 1,
  textTransform: 'none',
  fontSize: '1rem',
  fontWeight: 700,
  color:
    theme.palette.mode === 'light'
      ? theme.palette.common.black
      : theme.palette.common.white,
  [`&.${tabClasses.selected}`]: {
    color:
      theme.palette.mode === 'light'
        ? theme.palette.common.black
        : theme.palette.common.white,
  },
}));

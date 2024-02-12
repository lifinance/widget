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
  borderRadius: Math.max(
    theme.shape.borderRadius,
    theme.shape.borderRadiusSecondary,
  ),
  padding: theme.spacing(0.5),
  flex: 1,
  [`.${tabsClasses.indicator}`]: {
    height: '100%',
    width: '100%',
    backgroundColor:
      theme.palette.mode === 'dark'
        ? theme.palette.background.default
        : theme.palette.common.white,
    borderRadius:
      Math.max(theme.shape.borderRadius, theme.shape.borderRadiusSecondary) - 4,
    boxShadow: `0px 2px 4px ${alpha(theme.palette.common.black, 0.04)}`,
  },
}));

export const Tab = styled(MuiTab, {
  shouldForwardProp: (prop) => prop !== 'isDarkMode',
})<TabProps>(({ theme }) => ({
  zIndex: 1,
  flex: 1,
  textTransform: 'none',
  fontSize: '1rem',
  fontWeight: 700,
  color:
    theme.palette.mode === 'dark'
      ? theme.palette.common.white
      : theme.palette.common.black,
  [`&.${tabClasses.selected}`]: {
    color:
      theme.palette.mode === 'dark'
        ? theme.palette.common.white
        : theme.palette.common.black,
  },
}));

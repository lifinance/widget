import type { StyledComponent } from '@emotion/styled';
import type { TabProps, TabsProps } from '@mui/material';
import {
  Tab as MuiTab,
  Tabs as MuiTabs,
  tabClasses,
  tabsClasses,
} from '@mui/material';
import { alpha, styled } from '@mui/material/styles';

export const Tabs: StyledComponent<TabsProps> = styled(MuiTabs)(
  ({ theme }) => ({
    backgroundColor:
      theme.palette.mode === 'dark'
        ? theme.palette.background.paper
        : alpha(theme.palette.common.black, 0.04),
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
      borderRadius: theme.shape.borderRadiusSecondary,
      boxShadow: `0px 2px 4px ${alpha(theme.palette.common.black, 0.04)}`,
    },
  }),
);

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

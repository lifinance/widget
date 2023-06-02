import type { StyledComponent } from '@emotion/styled';
import type { TabProps, TabsProps } from '@mui/material';
import { Tab, Tabs, tabClasses, tabsClasses } from '@mui/material';
import { alpha, styled } from '@mui/material/styles';

export const NavbarTabs: StyledComponent<TabsProps> = styled(Tabs)(
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
    display: 'flex',
    alignItems: 'center',
    height: 56,
    [`.${tabsClasses.flexContainer}`]: {
      alignItems: 'center',
    },
    [`.${tabsClasses.scroller}`]: {
      overflow: 'initial !important',
    },
    [`.${tabsClasses.indicator}`]: {
      position: 'absolute',
      top: '50%',
      transform: 'translateY(-50%)',
      height: 48,
      backgroundColor:
        theme.palette.mode === 'dark'
          ? theme.palette.background.default
          : theme.palette.common.white,
      borderRadius: theme.shape.borderRadiusSecondary,
      boxShadow: `0px 2px 4px ${alpha(theme.palette.common.black, 0.04)}`,
    },
  }),
);

export const NavbarTab = styled(Tab, {
  shouldForwardProp: (prop) => prop !== 'isDarkMode',
})<TabProps>(({ theme }) => ({
  zIndex: 1,
  display: 'flex',
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
  flexDirection: 'row',
  textTransform: 'none',
  height: 48,
  minHeight: 48,
  fontSize: '1rem',
  fontWeight: 700,
  color:
    theme.palette.mode === 'dark'
      ? theme.palette.common.white
      : theme.palette.common.black,
  textDecoration: 'none',
  [`&.${tabClasses.selected}`]: {
    color:
      theme.palette.mode === 'dark'
        ? theme.palette.common.white
        : theme.palette.common.black,
    backgroundColor: 'transparent',
  },
  [`.${tabClasses.iconWrapper}`]: {
    margin: theme.spacing(0, 1, 0, 0),
  },
}));

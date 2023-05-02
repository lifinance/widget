import type { TabProps } from '@mui/material';
import { Tab, Tabs, tabClasses, tabsClasses } from '@mui/material';
import { alpha, styled } from '@mui/material/styles';

export const NavbarTabs = styled(Tabs)(({ theme }) => ({
  backgroundColor:
    theme.palette.mode === 'dark'
      ? theme.palette.common.white
      : alpha(theme.palette.common.black, 0.04),
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(0.5),
  flex: 1,
  display: 'flex',
  alignItems: 'center',
  height: 48,
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
    height: 40,
    backgroundColor:
      theme.palette.mode === 'dark'
        ? theme.palette.common.black
        : theme.palette.common.white,
    borderRadius: theme.shape.borderRadiusSecondary,
    boxShadow: `0px 2px 4px ${alpha(theme.palette.common.black, 0.04)}`,
  },
}));

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
  height: 40,
  minHeight: 40,
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

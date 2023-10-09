import { Button, IconButton, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

const getButtonTransformWidth = (
  drawerWidth?: number | string,
  drawerMaxWidth?: number | string,
) => {
  if (typeof drawerWidth === 'number') {
    return `${drawerWidth}px`;
  }
  if (typeof drawerWidth === 'string' && !drawerWidth.includes('%')) {
    return drawerWidth;
  }
  if (typeof drawerMaxWidth === 'number') {
    return `${drawerMaxWidth}px`;
  }
  if (typeof drawerMaxWidth === 'string' && !drawerMaxWidth.includes('%')) {
    return drawerMaxWidth;
  }
  return '392px';
};

export const DrawerButton = styled(Button, {
  shouldForwardProp: (prop) =>
    !['open', 'drawerProps'].includes(prop as string),
})<{
  open?: boolean;
  drawerProps?: {
    width?: number | string;
    maxWidth?: number | string;
  };
}>(({ theme, open, drawerProps }) => ({
  background:
    theme.palette.mode === 'light'
      ? theme.palette.common.black
      : theme.palette.common.white,
  color:
    theme.palette.mode === 'light'
      ? theme.palette.common.white
      : theme.palette.common.black,
  alignItems: 'center',
  borderRadius: `${theme.shape.borderRadiusSecondary}px 0 0 ${theme.shape.borderRadiusSecondary}px`,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  minHeight: 144,
  minWidth: 40,
  padding: theme.spacing(1, 0, 1, 0),
  position: 'absolute',
  right: 0,
  top: 'calc(50% - 74px)',
  transform: `translate3d(calc(${
    open
      ? getButtonTransformWidth(drawerProps?.width, drawerProps?.maxWidth)
      : '0px'
  } * -1), 0, 0)`,
  transition: theme.transitions.create(['transform'], {
    duration: open
      ? theme.transitions.duration.enteringScreen
      : theme.transitions.duration.leavingScreen,
    easing: open
      ? theme.transitions.easing.easeOut
      : theme.transitions.easing.sharp,
  }),
  zIndex: 1500,
  '&:hover': {
    background:
      theme.palette.mode === 'light'
        ? theme.palette.common.black
        : theme.palette.common.white,
  },
  svg: {
    color:
      theme.palette.mode === 'light'
        ? theme.palette.common.white
        : theme.palette.common.black,
  },
}));

export const DrawerButtonTypography = styled(Typography)(({ theme }) => ({
  borderRadius: `0 ${theme.shape.borderRadiusSecondary}px ${theme.shape.borderRadiusSecondary}px 0`,
  background:
    theme.palette.mode === 'light'
      ? theme.palette.common.black
      : theme.palette.common.white,
  color:
    theme.palette.mode === 'light'
      ? theme.palette.common.white
      : theme.palette.common.black,
  cursor: 'pointer',
  display: 'flex',
  flexDirection: 'row',
  padding: theme.spacing(1),
  position: 'relative',
  textTransform: 'none',
  transform: 'rotateZ(180deg)',
  writingMode: 'vertical-rl',
}));

export const CloseButtonLayout = styled(IconButton)(() => ({
  position: 'absolute',
  top: '12px',
  right: '26px',
  zIndex: 1,
  height: '40px',
  width: '40px',
  alignItems: 'center',
  justifyContent: 'center',
}));

import { Button, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

export const DrawerButton = styled(Button, {
  shouldForwardProp: (prop) => prop !== 'open',
})<{ open?: boolean }>(({ theme, open }) => ({
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
  height: 148,
  justifyContent: 'center',
  minWidth: 40,
  padding: theme.spacing(1, 0, 1, 0),
  position: 'absolute',
  right: 0,
  top: 'calc(50% - 74px)',
  transform: `translate3d(calc(${open ? '392px' : '0px'} * -1), 0, 0)`,
  transition: theme.transitions.create(['transform'], {
    duration: theme.transitions.duration.enteringScreen,
    easing: theme.transitions.easing.easeOut,
  }),
  zIndex: 1500,
  '&:hover': {
    background:
      theme.palette.mode === 'light'
        ? theme.palette.common.black
        : theme.palette.common.white,
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
  fontSize: '18px',
  padding: theme.spacing(1),
  position: 'relative',
  textTransform: 'none',
  transform: 'rotateZ(180deg)',
  writingMode: 'vertical-rl',
}));

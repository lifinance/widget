import { Box, Container as MuiContainer } from '@mui/material';
import { styled } from '@mui/material/styles';

export const Container = styled(MuiContainer)(({ theme }) => ({
  padding: theme.spacing(0, 2),
  marginLeft: 'unset',
}));

export const ArrowBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'flex-end',
  justifyContent: 'center',
  height: 23,
  width: 34,
  paddingBottom: 1,
}));

export const Arrow = styled(Box)(({ theme }) => ({
  position: 'relative',
  display: 'inline-block',
  verticalAlign: 'middle',
  boxSizing: 'border-box',
  width: 8,
  height: 8,
  borderWidth: '1px 1px 0 0',
  borderStyle: 'solid',
  borderColor: theme.palette.grey[300],
  transform: 'rotate(135deg)',
  '&:before': {
    content: '""',
    position: 'absolute',
    right: -0.5,
    top: 0,
    height: 24,
    width: 1,
    boxShadow: `inset 0 0 0 32px ${theme.palette.grey[300]}`,
    transform: 'rotate(45deg)',
    transformOrigin: 'right top',
  },
}));

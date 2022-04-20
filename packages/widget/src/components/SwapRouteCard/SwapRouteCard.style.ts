import { Box } from '@mui/material';
import { styled } from '@mui/material/styles';

export const Card = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'active' && prop !== 'blur',
})<{ active?: boolean; blur?: boolean }>(({ theme, active, blur }) => ({
  backgroundColor: theme.palette.common.white,
  padding: theme.spacing(2),
  border: `2px solid ${
    active ? theme.palette.primary.main : theme.palette.grey[200]
  }`,
  borderRadius: theme.shape.borderRadius,
  boxSizing: 'border-box',
  userSelect: blur ? 'none' : 'auto',
  '&:hover': {
    cursor: blur ? 'pointer' : 'default',
  },
  '& > div': {
    filter: blur ? 'blur(3px)' : 'none',
  },
}));

export const Label = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'active',
})<{ active?: boolean }>(({ theme, active }) => ({
  backgroundColor: active
    ? theme.palette.primary.main
    : theme.palette.common.white,
  border: '1px solid',
  borderColor: active ? theme.palette.primary.main : theme.palette.common.black,
  borderRadius: 4,
  color: active ? theme.palette.common.white : theme.palette.common.black,
  padding: theme.spacing(0.5, 0.75),
  fontSize: 12,
  fontWeight: '600',
  letterSpacing: '0.05rem',
  textTransform: 'uppercase',
  display: 'inline-flex',
  userSelect: 'none',
}));

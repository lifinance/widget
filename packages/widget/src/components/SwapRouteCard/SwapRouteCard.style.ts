import { Box } from '@mui/material';
import { styled } from '@mui/material/styles';

export const Card = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'active',
})<{ active?: boolean }>(({ theme, active }) => ({
  padding: theme.spacing(2),
  border: `2px solid ${
    active ? theme.palette.primary.main : theme.palette.grey[200]
  }`,
  borderRadius: theme.shape.borderRadius,
  boxSizing: 'border-box',
  // maxWidth: '50%',
  // flexBasis: '50%',
  // flexGrow: 0,
  // flexShrink: 0,
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
}));

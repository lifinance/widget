import { styled } from '@mui/material/styles';
import { Box, ButtonBase, Typography } from '@mui/material';

export const CardRowButton = styled(ButtonBase)(({ theme }) => ({
  background: 'none',
  color: 'inherit',
  border: 'none',
  font: 'inherit',
  cursor: 'pointer',
  outline: 'inherit',
  display: 'flex',
  width: '100%',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
}));

export const CardValue = styled(Typography)({
  lineHeight: '1.25',
  fontWeight: 500,
});

export const CardTitleContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1.5),
}));

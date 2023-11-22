import { styled } from '@mui/material/styles';
import { Box, ButtonBase, Typography } from '@mui/material';

export const SettingsList = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1),
  padding: theme.spacing(1, 3, 2),
}));

export const SettingTitle = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1.5),
}));

const SettingSummaryBase = {
  display: 'flex',
  width: '100%',
  justifyContent: 'space-between',
  alignItems: 'center',
};
export const SettingSummary = styled(Box)({
  ...SettingSummaryBase,
});

export const SettingSummaryButton = styled(ButtonBase)({
  background: 'none',
  color: 'inherit',
  border: 'none',
  padding: 0,
  font: 'inherit',
  cursor: 'pointer',
  outline: 'inherit',
  ...SettingSummaryBase,
});

export const SettingSummaryText = styled(Typography)({
  lineHeight: '1.25',
  fontWeight: 500,
});

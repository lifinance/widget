import { Box, ButtonBase, Badge as MuiBadge, Typography } from '@mui/material';
import { badgeClasses } from '@mui/material/Badge';
import { styled } from '@mui/material/styles';

export const SettingsList = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1),
  padding: theme.spacing(1, 0, 1),
}));

export const SummaryTitleContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1.5),
}));

export const SummaryRowContainer = styled(Box)({
  display: 'flex',
  width: '100%',
  justifyContent: 'space-between',
  alignItems: 'center',
});

export const SummaryRowButton = styled(ButtonBase)({
  background: 'none',
  color: 'inherit',
  border: 'none',
  padding: 0,
  font: 'inherit',
  cursor: 'pointer',
  outline: 'inherit',
  display: 'flex',
  width: '100%',
  justifyContent: 'space-between',
  alignItems: 'center',
});

export const SummaryValue = styled(Typography)({
  lineHeight: '1.25',
  fontWeight: 500,
});

export const Badge = styled(MuiBadge)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1.25),
  [`.${badgeClasses.badge}`]: {
    width: 10,
    height: 10,
    // the following removes MUI styling so we can position the badge with flex
    position: 'relative',
    transform: 'translateX(0)',
    borderRadius: '50%',
  },
}));

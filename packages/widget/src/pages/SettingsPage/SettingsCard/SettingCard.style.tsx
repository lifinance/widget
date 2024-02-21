import { Box, Badge as MuiBadge, badgeClasses, styled } from '@mui/material';

export const SettingsList = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1),
}));

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

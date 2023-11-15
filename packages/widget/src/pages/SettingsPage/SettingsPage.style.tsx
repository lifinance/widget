import { Card } from '../../components/Card';
import { styled } from '@mui/material/styles';
import { Box, ButtonBase, Typography } from '@mui/material';
import { PropsWithChildren } from 'react';

export const SettingCard: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <Card
      variant="default"
      selectionColor="primary"
      sx={{
        p: 2,
      }}
    >
      {children}
    </Card>
  );
};

export const SettingTitle = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1.5),
}));

export const SettingSummaryButton = styled(ButtonBase)(({ theme }) => ({
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
}));

export const SettingSummaryText = styled(Typography)(({ theme }) => ({
  lineHeight: '1.25',
  fontWeight: 500,
}));

import { Card } from '../../components/Card';
import { styled } from '@mui/material/styles';
import { Box, ButtonBase, Typography } from '@mui/material';
import { MouseEventHandler, PropsWithChildren, ReactNode } from 'react';

export const SettingsList = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1),
  padding: theme.spacing(1, 3, 2),
}));

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

export const SettingSummaryText = styled(Typography)(() => ({
  lineHeight: '1.25',
  fontWeight: 500,
}));

interface SettingCardTitle {
  icon: ReactNode;
  title: ReactNode;
}
interface SettingCardButtonProps extends SettingCardTitle {
  onClick: MouseEventHandler;
  additionalInfo: ReactNode;
}
export const SettingCardButton: React.FC<SettingCardButtonProps> = ({
  onClick,
  icon,
  title,
  additionalInfo,
}) => (
  <SettingCard>
    <SettingSummaryButton onClick={onClick} focusRipple>
      <SettingTitle>
        {icon}
        <SettingSummaryText>{title}</SettingSummaryText>
      </SettingTitle>
      <SettingSummaryText>{additionalInfo}</SettingSummaryText>
    </SettingSummaryButton>
  </SettingCard>
);

interface SettingCardComponentProps extends SettingCardTitle {
  component: ReactNode;
}

export const SettingCardComponent: React.FC<SettingCardComponentProps> = ({
  icon,
  title,
  component,
}) => (
  <SettingCard>
    <SettingSummary>
      <SettingTitle>
        {icon}
        <SettingSummaryText>{title}</SettingSummaryText>
      </SettingTitle>
      {component}
    </SettingSummary>
  </SettingCard>
);

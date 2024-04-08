import { WarningRounded } from '@mui/icons-material';
import { Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { AlertMessage } from '../AlertMessage/AlertMessage.js';

export const FundsSufficiencyMessage = () => {
  const { t } = useTranslation();
  return (
    <AlertMessage
      severity="warning"
      icon={<WarningRounded />}
      title={
        <Typography variant="body2" px={1} color="text.primary">
          {t(`warning.message.insufficientFunds`)}
        </Typography>
      }
      multilineTitle
    />
  );
};

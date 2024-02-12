import { WarningRounded } from '@mui/icons-material';
import { Typography, styled } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { AlertMessage } from '../AlertMessage/AlertMessage.js';

// TODO: some of the styling currently used here doesn't align with usage in other places
//  We might want to consider removing the padding and color here?
const AlertTitle = styled(Typography)(({ theme }) => {
  return {
    ...theme.typography.body2,
    paddingRight: theme.spacing(1),
    paddingLeft: theme.spacing(1),
    color: theme.palette.text.primary,
  };
});
export const FundsSufficiencyMessage = () => {
  const { t } = useTranslation();
  return (
    <AlertMessage
      severity="warning"
      icon={<WarningRounded />}
      title={<AlertTitle>{t(`warning.message.insufficientFunds`)}</AlertTitle>}
      isMultilineTitle
    />
  );
};

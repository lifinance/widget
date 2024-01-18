import WarningRoundedIcon from '@mui/icons-material/WarningRounded';
import { Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { AlertMessage } from '../AlertMessage';
import { styled } from '@mui/material/styles';

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
      icon={<WarningRoundedIcon />}
      title={<AlertTitle>{t(`warning.message.insufficientFunds`)}</AlertTitle>}
      isMultilineTitle
    />
  );
};

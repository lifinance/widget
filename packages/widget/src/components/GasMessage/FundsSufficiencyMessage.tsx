import WarningRoundedIcon from '@mui/icons-material/WarningRounded';
import { Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import {
  WarningMessageCard,
  WarningMessageCardTitle,
} from './GasMessage.style';

export const FundsSufficiencyMessage = () => {
  const { t } = useTranslation();
  return (
    <WarningMessageCard display="flex">
      <WarningMessageCardTitle>
        <WarningRoundedIcon
          sx={{
            marginTop: 2,
            marginLeft: 2,
          }}
        />
      </WarningMessageCardTitle>
      <Typography variant="body2" px={2} pb={2} pt={2}>
        {t(`warning.message.insufficientFunds`)}
      </Typography>
    </WarningMessageCard>
  );
};

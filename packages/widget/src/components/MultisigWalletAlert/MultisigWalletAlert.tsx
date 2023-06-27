import React from 'react';
import InfoRoundedIcon from '@mui/icons-material/InfoRounded';
import {
  MultisigWalletAlertContainer,
  MultisigWalletAlertContent,
  MultisigWalletAlertTitle,
} from './MultisigWalletAlert.style';
import { Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

export const MultisigWalletAlert = () => {
  const { t } = useTranslation();

  return (
    <MultisigWalletAlertContainer>
      <MultisigWalletAlertTitle>
        <InfoRoundedIcon />
        <Typography fontWeight={700} marginLeft={1}>
          {t(`multisig.alert.title`)}
        </Typography>
      </MultisigWalletAlertTitle>
      <MultisigWalletAlertContent marginTop={1.5}>
        {t(`multisig.alert.description`)}
      </MultisigWalletAlertContent>
    </MultisigWalletAlertContainer>
  );
};

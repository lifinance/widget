import { isAddress } from '@ethersproject/address';
import { Button } from '@mui/material';
import { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { FormKey, useWallet } from '../../providers';
import { navigationRoutes } from '../../utils';

export const SendToWalletConfirmButton = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { watch } = useFormContext();
  const value = watch(FormKey.ToAddress);
  const { account } = useWallet();
  const [isValidAddressOrENS, setIsValidAddressOrENS] = useState(false);
  const checkIsValidAddressOrENS = async (
    value: string,
    signer?: any,
  ): Promise<boolean> => {
    if (!value) {
      return false;
    }
    try {
      const address = await signer?.provider?.resolveName(value);
      return isAddress(address || value);
    } catch {
      return false;
    }
  };

  useEffect(() => {
    const checkValidity = async () => {
      setIsValidAddressOrENS(
        await checkIsValidAddressOrENS(value, account.signer),
      );
    };
    checkValidity();
  }, [value, account.signer]);

  return (
    <Button
      variant="contained"
      onClick={() => navigate(navigationRoutes.home)}
      autoFocus
      disabled={!isValidAddressOrENS}
    >
      {t('button.confirm')}
    </Button>
  );
};

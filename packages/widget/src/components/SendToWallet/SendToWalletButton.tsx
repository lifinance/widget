import { Collapse } from '@mui/material';
import ErrorIcon from '@mui/icons-material/Error';
import WalletIcon from '@mui/icons-material/Wallet';
import { ReactNode, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { isAddress } from 'viem';
import {
  useAccount,
  useAddressAndENSValidation,
  useRequiredToAddress,
} from '../../hooks';
import { useWidgetConfig } from '../../providers';
import {
  useBookmarks,
  useFieldActions,
  useFieldValues,
  useSendToWalletStore,
  useSettings,
} from '../../stores';
import { AlertSection } from '../AlertSection';
import { DisabledUI, HiddenUI } from '../../types';
import { navigationRoutes, shortenAddress } from '../../utils';
import { Card, CardTitle } from '../Card';
import { SendToWalletCardHeader, WalletAvatarBase } from './SendToWallet.style';
// TODO: I should I pull bookmark styles out
import {
  BookmarkAddress,
  BookmarkItemContainer,
  BookmarkName,
} from '../../pages/SendToWallet/SendToWallet.style';

export const WalletAvatar = () => (
  <WalletAvatarBase>
    <WalletIcon sx={{ fontSize: 20 }} />
  </WalletAvatarBase>
);

export const SendToWalletButton = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { disabledUI, hiddenUI, toAddress } = useWidgetConfig();
  const { showSendToWallet, showSendToWalletDirty } = useSendToWalletStore();
  const { account } = useAccount();
  const { showDestinationWallet } = useSettings(['showDestinationWallet']);
  const [toAddressFieldValue] = useFieldValues('toAddress');
  const { getFieldValues } = useFieldActions();
  const { selectedBookmark } = useBookmarks();

  const disabledToAddress = disabledUI?.includes(DisabledUI.ToAddress);
  const hiddenToAddress = hiddenUI?.includes(HiddenUI.ToAddress);
  const requiredToAddress = useRequiredToAddress();
  const { validateAddressOrENS } = useAddressAndENSValidation();

  const [errorMessage, setErrorMessage] = useState('');

  const showInstantly =
    Boolean(
      !showSendToWalletDirty &&
        showDestinationWallet &&
        toAddress &&
        !hiddenToAddress,
    ) || requiredToAddress;

  const handleOnClick = () => {
    if (!(toAddress && disabledToAddress)) {
      navigate(navigationRoutes.sendToWallet);
    }
  };

  useEffect(() => {
    const [toAddress] = getFieldValues('toAddress');
    if (toAddress) {
      validateAddressOrENS(toAddress).then((validationCheck) =>
        setErrorMessage(validationCheck.error),
      );
      // Trigger validation if we change requiredToAddress in the runtime
    } else if (requiredToAddress) {
      validateAddressOrENS(toAddress).then((validationCheck) =>
        setErrorMessage(validationCheck.error),
      );
    }
  }, [
    account.chainId,
    getFieldValues,
    setErrorMessage,
    toAddressFieldValue,
    requiredToAddress,
    validateAddressOrENS,
  ]);

  let address: ReactNode;
  if (selectedBookmark) {
    address = (
      <BookmarkItemContainer>
        <BookmarkName>{selectedBookmark.name}</BookmarkName>
        <BookmarkAddress>
          {shortenAddress(selectedBookmark.address)}
        </BookmarkAddress>
      </BookmarkItemContainer>
    );
  } else {
    address = toAddressFieldValue
      ? isAddress(toAddressFieldValue)
        ? shortenAddress(toAddressFieldValue)
        : toAddressFieldValue
      : t('sendToWallet.enterAddressOrENS');
  }

  return (
    <Collapse
      timeout={showInstantly ? 0 : 225}
      in={showSendToWallet || showInstantly}
      mountOnEnter
      unmountOnExit
    >
      <>
        <Card onClick={handleOnClick} mb={2}>
          <CardTitle>{t('header.sendToWallet')}</CardTitle>
          <SendToWalletCardHeader
            avatar={<WalletAvatar />}
            title={address}
            selected={
              !!toAddressFieldValue && !(toAddress && disabledToAddress)
            }
          />
        </Card>
        {!!errorMessage && (
          <AlertSection
            sx={{ marginX: '1.5rem', marginBottom: '1rem' }}
            severity="info"
            icon={<ErrorIcon />}
          >
            {errorMessage}
          </AlertSection>
        )}
      </>
    </Collapse>
  );
};

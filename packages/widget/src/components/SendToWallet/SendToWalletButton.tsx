import { Collapse } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useAccount, useRequiredToAddress } from '../../hooks';
import { useWidgetConfig } from '../../providers';
import {
  useBookmarks,
  useFieldValues,
  useSendToWalletStore,
  useSettings,
} from '../../stores';
import { DisabledUI, HiddenUI } from '../../types';
import {
  defaultChainIdsByType,
  getChainTypeFromAddress,
  navigationRoutes,
  shortenAddress,
} from '../../utils';
import { Card, CardRowButton, CardTitle } from '../Card';
import { AccountAvatar } from '../AccountAvatar';
import { SendToWalletCardHeader } from './SendToWallet.style';

export const SendToWalletButton = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { disabledUI, hiddenUI, toAddress } = useWidgetConfig();
  const { showSendToWallet, showSendToWalletDirty } = useSendToWalletStore();
  const { showDestinationWallet } = useSettings(['showDestinationWallet']);
  const [toAddressFieldValue] = useFieldValues('toAddress');
  const { selectedBookmarkWallet } = useBookmarks();
  const { accounts } = useAccount();
  const disabledToAddress = disabledUI?.includes(DisabledUI.ToAddress);
  const hiddenToAddress = hiddenUI?.includes(HiddenUI.ToAddress);
  const requiredToAddress = useRequiredToAddress();

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

  const address = toAddressFieldValue
    ? getChainTypeFromAddress(toAddressFieldValue)
      ? shortenAddress(toAddressFieldValue)
      : toAddressFieldValue
    : t('sendToWallet.enterAddressOrENS');

  const matchingConnectedAccount = accounts.find(
    (account) => account.address === toAddressFieldValue,
  );

  const chainId = matchingConnectedAccount
    ? matchingConnectedAccount.chainId
    : selectedBookmarkWallet?.chainType
      ? defaultChainIdsByType[selectedBookmarkWallet?.chainType]
      : undefined;

  const headerTitle = selectedBookmarkWallet?.name || address;
  const headerSubheader = !!selectedBookmarkWallet?.name && address;

  return (
    <Collapse
      timeout={showInstantly ? 0 : 225}
      in={showSendToWallet || showInstantly}
      mountOnEnter
      unmountOnExit
    >
      <>
        <Card mb={2}>
          <CardRowButton
            onClick={handleOnClick}
            disableRipple
            sx={{
              flexDirection: 'column',
              padding: 0,
              alignItems: 'flex-start',
            }}
          >
            <CardTitle>{t('header.sendToWallet')}</CardTitle>
            <SendToWalletCardHeader
              avatar={
                <AccountAvatar
                  chainId={chainId}
                  account={matchingConnectedAccount}
                />
              }
              title={headerTitle}
              subheader={headerSubheader}
              selected={
                !!toAddressFieldValue && !(toAddress && disabledToAddress)
              }
            />
          </CardRowButton>
        </Card>
      </>
    </Collapse>
  );
};

import { Collapse } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useAccount, useToAddressRequirements } from '../../hooks';
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
import { Card, CardRowContainer, CardTitle } from '../Card';
import { AccountAvatar } from '../AccountAvatar';
import { SendToWalletCardHeader } from './SendToWallet.style';

const SendToWalletCard = Card.withComponent('button');

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
  const { requiredToAddress } = useToAddressRequirements();

  const showInstantly =
    Boolean(
      !showSendToWalletDirty &&
        showDestinationWallet &&
        toAddress &&
        !hiddenToAddress,
    ) || requiredToAddress;

  const handleOnClick = () => {
    navigate(navigationRoutes.sendToWallet);
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

  const headerTitle = selectedBookmarkWallet?.isConnectedAccount
    ? matchingConnectedAccount?.connector?.name || address
    : selectedBookmarkWallet?.name || address;
  const headerSubheader = selectedBookmarkWallet?.isConnectedAccount
    ? !!matchingConnectedAccount && address
    : !!selectedBookmarkWallet?.name && address;

  return (
    <Collapse
      timeout={showInstantly ? 0 : 225}
      in={showSendToWallet || showInstantly}
      mountOnEnter
      unmountOnExit
    >
      <>
        <SendToWalletCard
          sx={{ mb: 2 }}
          onClick={!!toAddress && disabledToAddress ? undefined : handleOnClick}
          disabled={!!toAddress && disabledToAddress}
        >
          <CardRowContainer
            sx={{
              flexDirection: 'column',
              padding: 0,
              alignItems: 'flex-start',
            }}
          >
            <CardTitle required={requiredToAddress}>
              {t('header.sendToWallet')}
            </CardTitle>
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
          </CardRowContainer>
        </SendToWalletCard>
      </>
    </Collapse>
  );
};

import { Collapse } from '@mui/material';
import { useEffect } from 'react';
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
import { AccountAvatar } from '../AccountAvatar';
import { Card, CardRowContainer, CardTitle } from '../Card';
import { SendToWalletCardHeader } from './SendToWallet.style';

export const SendToWalletButton = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { disabledUI, hiddenUI, toAddress } = useWidgetConfig();
  const { showSendToWallet, showSendToWalletDirty, setSendToWallet } =
    useSendToWalletStore();
  const { showDestinationWallet } = useSettings(['showDestinationWallet']);
  const [toAddressFieldValue] = useFieldValues('toAddress');
  const { selectedBookmark } = useBookmarks();
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

  const address = toAddressFieldValue
    ? shortenAddress(toAddressFieldValue)
    : t('sendToWallet.enterAddress');

  const matchingConnectedAccount = accounts.find(
    (account) => account.address === toAddressFieldValue,
  );

  const chainType = !matchingConnectedAccount
    ? selectedBookmark?.chainType ||
      (toAddressFieldValue
        ? getChainTypeFromAddress(toAddressFieldValue)
        : undefined)
    : undefined;

  const chainId = matchingConnectedAccount
    ? matchingConnectedAccount.chainId
    : chainType
      ? defaultChainIdsByType[chainType]
      : undefined;

  const headerTitle = selectedBookmark?.isConnectedAccount
    ? matchingConnectedAccount?.connector?.name || address
    : selectedBookmark?.name || address;

  const headerSubheader = selectedBookmark?.isConnectedAccount
    ? !!matchingConnectedAccount && address
    : !!selectedBookmark?.name && address;

  const handleOnClick = () => {
    navigate(navigationRoutes.sendToWallet);
  };

  // Sync SendToWalletExpandButton state
  // TODO: find better way
  useEffect(() => {
    if (showInstantly) {
      setSendToWallet(true);
    }
  }, [showInstantly, setSendToWallet]);

  return (
    <Collapse
      timeout={showInstantly ? 0 : 225}
      in={showSendToWallet || showInstantly}
      mountOnEnter
      unmountOnExit
    >
      <Card
        component="button"
        onClick={!!toAddress && disabledToAddress ? undefined : handleOnClick}
        sx={{ mb: 2 }}
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
      </Card>
    </Collapse>
  );
};

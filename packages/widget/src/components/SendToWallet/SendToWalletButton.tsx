import { Collapse } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useAccount } from '../../hooks/useAccount.js';
import { useToAddressRequirements } from '../../hooks/useToAddressRequirements.js';
import { useWidgetConfig } from '../../providers/WidgetProvider/WidgetProvider.js';
import { useBookmarks } from '../../stores/bookmarks/useBookmarks.js';
import { useFieldValues } from '../../stores/form/useFieldValues.js';
import { useSendToWalletStore } from '../../stores/settings/useSendToWalletStore.js';
import { useSettings } from '../../stores/settings/useSettings.js';
import { DisabledUI, HiddenUI } from '../../types/widget.js';
import {
  defaultChainIdsByType,
  getChainTypeFromAddress,
} from '../../utils/chainType.js';
import { navigationRoutes } from '../../utils/navigationRoutes.js';
import { shortenAddress } from '../../utils/wallet.js';
import { AccountAvatar } from '../AccountAvatar.js';
import { Card } from '../Card/Card.js';
import { CardRowContainer } from '../Card/CardButton.style.js';
import { CardTitle } from '../Card/CardTitle.js';
import { SendToWalletCardHeader } from './SendToWallet.style.js';

export const SendToWalletButton = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { disabledUI, hiddenUI, toAddress, toAddresses } = useWidgetConfig();
  const { showSendToWallet, showSendToWalletDirty } = useSendToWalletStore();
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

  const isConnectedAccount = selectedBookmark?.isConnectedAccount;
  const connectedAccountName = matchingConnectedAccount?.connector?.name;
  const bookmarkName = selectedBookmark?.name;

  const headerTitle = isConnectedAccount
    ? connectedAccountName || address
    : bookmarkName || connectedAccountName || address;

  const headerSubheader =
    isConnectedAccount || bookmarkName || connectedAccountName ? address : null;

  const handleOnClick = () => {
    navigate(
      toAddresses?.length
        ? navigationRoutes.configuredWallets
        : navigationRoutes.sendToWallet,
    );
  };

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

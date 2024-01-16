import { useRef, useState } from 'react';
import TurnedInIcon from '@mui/icons-material/TurnedIn';
import {
  ListContainer,
  SendToWalletPageContainer,
} from './SendToWalletPage.style';
import { useTranslation } from 'react-i18next';
import type { BookmarkedWallet } from '../../stores';
import { defaultChainIdsByType, shortenAddress } from '../../utils';
import { ConfirmAddressSheet } from './ConfirmAddressSheet';
import { EmptyListIndicator } from './EmptyListIndicator';
import { ListItem } from '../../components/ListItem';
import type { BottomSheetBase } from '../../components/BottomSheet';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import type { Account } from '../../hooks';
import { useAccount, useChains } from '../../hooks';
import { AccountAvatar } from '../../components/AccountAvatar';
import { useBookmarksActions } from '../../stores';
import { ListItemAvatar, ListItemText } from '@mui/material';
export const ConnectedWalletsPage = () => {
  const { t } = useTranslation();
  const [selectedAccount, setSelectedAccount] = useState<Account | undefined>();
  const confirmAddressSheetRef = useRef<BottomSheetBase>(null);
  const { accounts } = useAccount();
  const connectedWallets = accounts.filter((account) => account.isConnected);
  const { setSelectedBookmarkWallet } = useBookmarksActions();
  const { getChainById } = useChains();

  const handleWalletSelected = (account: Account) => {
    setSelectedAccount(account);
    confirmAddressSheetRef.current?.open();
  };

  const handleOnConfirm = (accountWalletDetails: BookmarkedWallet) => {
    setSelectedBookmarkWallet(accountWalletDetails);
  };
  const handleCopyAddress = (account: Account) => {
    if (account.address) {
      navigator.clipboard.writeText(account.address);
    }
  };

  const handleViewOnExplorer = (account: Account) => {
    const chain = getChainById(defaultChainIdsByType[account.chainType]);
    window.open(
      `${chain?.metamask.blockExplorerUrls[0]}address/${account.address}`,
      '_blank',
    );
  };

  return (
    <SendToWalletPageContainer disableGutters>
      <ListContainer>
        {connectedWallets.map((account) => {
          const walletAddress = shortenAddress(account.address);

          return (
            <ListItem<Account>
              key={account.address}
              itemData={account}
              onSelected={handleWalletSelected}
              menuItems={[
                {
                  id: 'copyAddressMenuItem',
                  children: (
                    <>
                      <ContentCopyIcon />
                      {t('button.copyAddress')}
                    </>
                  ),
                  action: handleCopyAddress,
                },
                {
                  id: 'viewOnExplorerMenuItem',
                  children: (
                    <>
                      <OpenInNewIcon />
                      {t('button.viewOnExplorer')}
                    </>
                  ),
                  action: handleViewOnExplorer,
                },
              ]}
            >
              <ListItemAvatar>
                <AccountAvatar chainId={account.chainId} account={account} />
              </ListItemAvatar>
              <ListItemText
                primary={account.connector?.name}
                secondary={walletAddress}
              />
            </ListItem>
          );
        })}
        {!connectedWallets.length && (
          <EmptyListIndicator icon={<TurnedInIcon sx={{ fontSize: 48 }} />}>
            {t('sendToWallet.noConnectedWallets')}
          </EmptyListIndicator>
        )}
      </ListContainer>
      <ConfirmAddressSheet
        ref={confirmAddressSheetRef}
        validatedWallet={
          selectedAccount && {
            name: selectedAccount.connector?.name,
            address: selectedAccount.address!,
            addressType: 'address',
            chainType: selectedAccount.chainType,
          }
        }
        onConfirm={handleOnConfirm}
      />
    </SendToWalletPageContainer>
  );
};

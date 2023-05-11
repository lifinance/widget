import { EventEmitter } from 'events';
import type { Wallet } from './types';
import {
  addToActiveWallets,
  addToDeactivatedWallets,
  removeFromActiveWallets,
  removeFromDeactivatedWallets,
} from './walletPersistance';

export class LiFiWalletManagement extends EventEmitter {
  connectedWallets: Wallet[] = [];

  public connect = async (wallet: Wallet) => {
    try {
      await wallet.connect();
      wallet.addListener('walletAccountChanged', this.handleAccountDataChange);
      this.connectedWallets.unshift(wallet);
      removeFromDeactivatedWallets({
        address: wallet.account?.address || '',
        name: wallet.name,
      });
      addToActiveWallets({
        address: wallet.account?.address || '',
        name: wallet.name,
      });
    } catch (e) {
      throw e;
    }
  };

  public async autoConnect(wallets: Wallet[]) {
    for (const wallet of wallets) {
      if (wallet.autoConnect) {
        await wallet.autoConnect();
        wallet.addListener(
          'walletAccountChanged',
          this.handleAccountDataChange,
        );
        this.connectedWallets.unshift(wallet);
      }
    }
  }

  public disconnect = async (wallet: Wallet) => {
    wallet.removeAllListeners();
    removeFromActiveWallets({
      address: wallet.account?.address || '',
      name: wallet.name,
    });
    addToDeactivatedWallets({
      address: wallet.account?.address || '',
      name: wallet.name,
    });

    wallet.disconnect();
  };

  private handleAccountDataChange() {
    this.emit('walletChanged', this.connectedWallets);
  }
}

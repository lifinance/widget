import events from 'events';
import type { Wallet } from './types';
import {
  addToActiveWallets,
  addToDeactivatedWallets,
  removeFromActiveWallets,
  removeFromDeactivatedWallets,
} from './walletPersistance';

export class LiFiWalletManagement extends events.EventEmitter {
  connectedWallets: Wallet[] = [];

  public connect = async (wallet: Wallet) => {
    try {
      await wallet.connect();
      wallet.addListener('walletAccountChanged', this.handleAccountDataChange);
      this.connectedWallets.push(wallet); // TODO: add new wallet as first element
      removeFromDeactivatedWallets(wallet.account?.address);
      addToActiveWallets(wallet.account?.address);
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
        this.connectedWallets.push(wallet); // TODO: add new wallet as first element
      }
    }
  }

  public disconnect = async (wallet: Wallet) => {
    const selectedAddress = wallet.account?.address;
    wallet.removeAllListeners();
    removeFromActiveWallets(selectedAddress);
    addToDeactivatedWallets(selectedAddress);

    wallet.disconnect();
  };

  private handleAccountDataChange() {
    this.emit('walletChanged', this.connectedWallets);
  }
}

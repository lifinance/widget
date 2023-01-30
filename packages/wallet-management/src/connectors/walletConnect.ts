import { supportedChains } from '@lifi/sdk';
import WalletConnectProvider from '@walletconnect/ethereum-provider';
import { initializeConnector } from '@web3-react/core';
import type { Actions } from '@web3-react/types';
import { Connector } from '@web3-react/types';
import type { EventEmitter } from 'node:events';

interface WalletConnectOptions {
  rpc: {
    [chainId: number]: string;
  };
}

interface MockWalletConnectProvider
  extends Omit<WalletConnectProvider, 'on' | 'off' | 'once' | 'removeListener'>,
    EventEmitter {}

export class WalletConnect extends Connector {
  private readonly options?: WalletConnectOptions;

  public provider: MockWalletConnectProvider | undefined;

  public walletConnectProvider: WalletConnectProvider | undefined;

  public isCurrentlyUsed: boolean = false;

  constructor(actions: Actions, options?: WalletConnectOptions) {
    super(actions);
    this.options = options;
  }

  private async startListening(): Promise<void> {
    // Subscribe to accounts change
    this.provider?.on('accountsChanged', (accounts: string[]) => {
      this.actions.update({ accounts });
    });

    // Subscribe to chainId change
    this.provider?.on('chainChanged', (chainId: number) => {
      this.actions.update({ chainId });
    });

    // Subscribe to session disconnection
    this.provider?.on('disconnect', (code: number, reason: string) => {
      this.actions.update({ accounts: [], chainId: undefined });
      this.actions.resetState();
      this.isCurrentlyUsed = false;
    });
  }

  public connectEagerly = () => {};

  public async activate(): Promise<void> {
    this.actions.startActivation();
    this.isCurrentlyUsed = true;

    // Reset provider for every connection attempt
    const walletConnectProvider = new WalletConnectProvider({
      rpc: this.options!.rpc,
    });
    this.provider =
      walletConnectProvider as unknown as MockWalletConnectProvider;
    this.walletConnectProvider = walletConnectProvider;

    await this.provider?.enable(); // open modal
    this.startListening();

    this.actions.update({ accounts: this.provider.accounts });

    this.actions.update({ chainId: this.provider.chainId });
  }

  public async deactivate(): Promise<void> {
    if (this.provider) {
      await this.provider?.disconnect();
      this.isCurrentlyUsed = false;
      this.actions.resetState();
    }
  }
}

export const [walletConnect, hooks] = initializeConnector<WalletConnect>(
  (actions) =>
    new WalletConnect(actions, {
      rpc: Object.fromEntries(
        supportedChains.map((chain) => {
          return [chain.id, chain.metamask.rpcUrls[0] || ''];
        }),
      ),
    }),
);

export const createWalletConnectConnector = () => {
  const [connector, hooks] = initializeConnector<WalletConnect>(
    (actions) =>
      new WalletConnect(actions, {
        rpc: Object.fromEntries(
          supportedChains.map((chain) => {
            return [chain.id, chain.metamask.rpcUrls[0] || ''];
          }),
        ),
      }),
  );
  return { connector, hooks };
};

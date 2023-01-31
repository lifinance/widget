import { supportedChains } from '@lifi/sdk';
import WalletConnectProvider from '@walletconnect/ethereum-provider';
import type {
  ConnectOps,
  EthereumRpcMap,
} from '@walletconnect/ethereum-provider/dist/types/EthereumProvider';
import { initializeConnector } from '@web3-react/core';
import type { Actions } from '@web3-react/types';
import { Connector } from '@web3-react/types';
import type { EventEmitter } from 'node:events';

type WalletConnectOptions = Omit<Required<ConnectOps>, 'pairingTopic'>;
interface MockWalletConnectProvider
  extends Omit<WalletConnectProvider, 'on' | 'off' | 'once' | 'removeListener'>,
    EventEmitter {}

export class WalletConnect extends Connector {
  private readonly options: WalletConnectOptions;

  public provider?: MockWalletConnectProvider;

  public walletConnectProvider?: WalletConnectProvider;

  public isCurrentlyUsed: boolean = false;

  constructor(actions: Actions, options: WalletConnectOptions) {
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
    const walletConnectProvider = await WalletConnectProvider.init({
      projectId: '5432e3507d41270bee46b7b85bbc2ef8',
      chains: this.options.chains,
      rpcMap: this.options.rpcMap,
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

export const createWalletConnectConnector = () => {
  const [connector, hooks] = initializeConnector<WalletConnect>(
    (actions) =>
      new WalletConnect(actions, {
        chains: supportedChains.map((chain) => chain.id),
        rpcMap: supportedChains.reduce((rpcMap, chain) => {
          rpcMap[`eip155:${chain.id}`] = chain.metamask.rpcUrls[0] || '';
          return rpcMap;
        }, {} as EthereumRpcMap),
      }),
  );
  return { connector, hooks };
};

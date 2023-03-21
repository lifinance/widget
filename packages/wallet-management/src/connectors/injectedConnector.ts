import type { Token } from '@lifi/sdk';
import { ethers } from 'ethers';
import events from 'events';
import type {
  AccountData,
  InjectedConnectorConstructorArgs,
  Provider,
  ProviderConnectInfo,
  ProviderRpcError,
  Wallet,
} from '../types';
import {
  addChain,
  switchChain,
  switchChainAndAddToken,
} from '../walletAutomation';

export class InjectedConnector extends events.EventEmitter implements Wallet {
  private windowProvider: Provider | undefined;
  public isActivationInProgress: boolean = false;
  public account: AccountData | undefined;
  public name: string;
  public icon: string;
  public installed: (helpers: { provider: any }) => boolean;

  constructor(
    constructorArgs: InjectedConnectorConstructorArgs,
    connectorWindowProperty = 'ethereum',
  ) {
    super();
    this.initializeProvider(connectorWindowProperty);
    this.name = constructorArgs.name;
    this.icon = constructorArgs.icon;
    this.installed = constructorArgs.installed;
  }

  private initializeProvider(connectorWindowProperty: string) {
    if (!window[connectorWindowProperty as any]) {
      throw new Error(
        `window.${connectorWindowProperty} is not a valid connector`,
      );
    }
    this.windowProvider = window[
      connectorWindowProperty as any
    ] as unknown as Provider;
    this.windowProvider?.on(
      'connect',
      async ({ chainId }: ProviderConnectInfo): Promise<void> => {
        console.log('on connect');
        await this.calcAccountData();
      },
    );
    this.windowProvider?.on(
      'disconnect',
      async (error: ProviderRpcError): Promise<void> => {
        console.log('on disconnect');
        await this.calcAccountData();
      },
    );
    this.windowProvider?.on(
      'chainChanged',
      async (chainId: string): Promise<void> => {
        console.log('on chainChanged');
        await this.calcAccountData();
      },
    );
    this.windowProvider?.on(
      'accountsChanged',
      async (accounts: string[]): Promise<void> => {
        console.log('on accountsChanged');
        if (!accounts.length) {
          this.account = undefined;
          this.emit('walletAccountChanged', this);
          return;
        }
        await this.calcAccountData();
      },
    );
  }

  public async connect() {
    if (window === undefined) {
      throw new Error('window is not defined. This should not have happened.');
    }

    if (!this.windowProvider) {
      throw new Error('provider is not defined.');
    }

    if (this.isActivationInProgress) {
      return;
    }

    this.isActivationInProgress = true;
    try {
      await this.windowProvider?.request({
        method: 'eth_requestAccounts',
      });
      await this.calcAccountData();
    } catch (error) {
      this.isActivationInProgress = false;
      throw error;
    }

    this.isActivationInProgress = false;
  }

  public disconnect(): void | Promise<void> {
    this.account = undefined;
    this.isActivationInProgress = false;
  }

  public async switchChain(chainId: number) {
    if (window === undefined) {
      throw new Error('window is not defined. This should not have happened.');
    }

    if (!this.windowProvider) {
      throw new Error('provider is not defined.');
    }
    return switchChain(this.windowProvider, chainId);
  }

  public async addChain(chainId: number) {
    if (window === undefined) {
      throw new Error('window is not defined. This should not have happened.');
    }

    if (!this.windowProvider) {
      throw new Error('provider is not defined.');
    }
    return addChain(this.windowProvider, chainId);
  }

  public async addToken(chainId: number, token: Token) {
    if (window === undefined) {
      throw new Error('window is not defined. This should not have happened.');
    }

    if (!this.windowProvider) {
      throw new Error('provider is not defined.');
    }
    return switchChainAndAddToken(this.windowProvider, chainId, token);
  }

  private async calcAccountData() {
    if (!this.windowProvider) {
      throw new Error('provider is not defined.');
    }
    const provider = new ethers.providers.Web3Provider(
      this.windowProvider,
      'any',
    );
    const signer = provider.getSigner();
    this.account = {
      chainId: await signer.getChainId(),
      address: await signer.getAddress(),
      signer,
      provider,
    };
    this.emit('walletAccountChanged', this);
  }
}

import type { Token } from '@lifi/sdk';
import type { Signer } from 'ethers';
import { ethers } from 'ethers';
import type { Provider, ProviderConnectInfo, ProviderRpcError } from '../types';
import {
  addChain,
  switchChain,
  switchChainAndAddToken,
} from '../walletAutomation';

export interface AccountData {
  chainId: number;
  address: string;
  signer: Signer;
  provider: ethers.providers.Web3Provider;
}

export class InjectedConnector {
  private windowProvider: Provider | undefined;
  isActivationInProgress: boolean = false; // TODO: check if needed
  account: AccountData | undefined;

  constructor(connectorWindowProperty = 'ethereum') {
    this.initializeProvider(connectorWindowProperty);
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
        }
        await this.calcAccountData();
      },
    );
  }

  public async activate() {
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

  public deactivate(): void | Promise<void> {
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
  }
}

import { Web3Provider } from '@ethersproject/providers';
import type { StaticToken } from '@lifi/sdk';
import events from 'events';
import type {
  AccountData,
  InjectedConnectorArgs,
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
import { isWalletDeactivated } from '../walletPersistance';

export class InjectedConnector extends events.EventEmitter implements Wallet {
  private windowProvider: Provider | undefined;
  public isActivationInProgress: boolean = false;
  public account: AccountData | undefined;
  public name: string;
  public icon: string;
  public installed: () => Promise<boolean>;

  constructor(
    constructorArgs: InjectedConnectorArgs,
    windowConnector = (window as any).ethereum as Provider,
    autoConnect = false,
  ) {
    super();
    this.initializeProvider(windowConnector);
    this.name = constructorArgs.name;
    this.icon = constructorArgs.icon;
    this.installed = constructorArgs.installed;
  }

  private initializeProvider(connectorWindowProperty: Provider) {
    if (window === undefined) {
      throw new Error('window is not defined. This should not have happened.');
    }
    this.windowProvider = connectorWindowProperty;
    this.windowProvider?.on(
      'connect',
      async ({ chainId }: ProviderConnectInfo): Promise<void> => {
        await this.calcAccountData();
      },
    );
    this.windowProvider?.on(
      'disconnect',
      async (error: ProviderRpcError): Promise<void> => {
        await this.calcAccountData();
      },
    );
    this.windowProvider?.on(
      'chainChanged',
      async (chainId: string): Promise<void> => {
        await this.calcAccountData();
      },
    );
    this.windowProvider?.on(
      'accountsChanged',
      async (accounts: string[]): Promise<void> => {
        if (!accounts.length) {
          this.account = undefined;

          this.emit('walletAccountChanged', this);
          return;
        }
        await this.calcAccountData();
      },
    );
  }
  public async autoConnect() {
    if (window === undefined) {
      throw new Error('window is not defined. This should not have happened.');
    }

    if (!this.windowProvider) {
      throw new Error('provider is not defined.');
    }

    if (this.isActivationInProgress) {
      return;
    }
    try {
      const selectedAddress = this.windowProvider.selectedAddress;
      if (
        !isWalletDeactivated({
          address: selectedAddress || '',
          name: this.name,
        })
      ) {
        await this.calcAccountData();
      }
    } catch (e) {
      throw e;
    }
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

    if (!this.account?.provider) {
      throw new Error('provider is not defined.');
    }
    return switchChain(this.account?.provider, chainId);
  }

  public async addChain(chainId: number) {
    if (window === undefined) {
      throw new Error('window is not defined. This should not have happened.');
    }

    if (!this.account?.provider) {
      throw new Error('provider is not defined.');
    }
    return addChain(this.account?.provider, chainId);
  }

  public async addToken(chainId: number, token: StaticToken) {
    if (window === undefined) {
      throw new Error('window is not defined. This should not have happened.');
    }

    if (!this.account?.provider) {
      throw new Error('provider is not defined.');
    }
    return switchChainAndAddToken(this.account?.provider, chainId, token);
  }

  private async calcAccountData() {
    if (!this.windowProvider) {
      throw new Error('provider is not defined.');
    }

    const provider = new Web3Provider(this.windowProvider, 'any');
    const accounts = await provider.listAccounts();

    if (!accounts.length) {
      return;
    }

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

import type { StaticToken } from '@lifi/sdk';
import WalletConnectProvider from '@walletconnect/ethereum-provider';
import { ethers } from 'ethers';
import events from 'events';
import type { EventEmitter } from 'node:events';
import type {
  AccountData,
  Wallet,
  WalletConnectConnectorConstructorArgs,
} from '../types';
import {
  addChain,
  switchChain,
  switchChainAndAddToken,
} from '../walletAutomation';

interface MockWalletConnectProvider
  extends Omit<WalletConnectProvider, 'on' | 'off' | 'once' | 'removeListener'>,
    EventEmitter {}

export class WalletConnectConnector
  extends events.EventEmitter
  implements Wallet
{
  private readonly options?: {
    [chainId: number]: string;
  };

  public provider: MockWalletConnectProvider | undefined;

  public walletConnectProvider: WalletConnectProvider | undefined;

  public isActivationInProgress: boolean = false;
  public account: AccountData | undefined;
  public name: string;
  public icon: string;
  public installed: () => boolean;

  constructor(constructorArgs: WalletConnectConnectorConstructorArgs) {
    super();
    this.options = constructorArgs.rpc;
    this.name = constructorArgs.name;
    this.icon = constructorArgs.icon;
    this.installed = constructorArgs.installed;
  }

  private async startListening(): Promise<void> {
    // Subscribe to accounts change
    this.provider?.on('accountsChanged', async (accounts: string[]) => {
      if (!accounts.length) {
        this.account = undefined;
        this.emit('walletAccountChanged', this);
        return;
      }
      await this.calcAccountData();
    });
    // Subscribe to chainId change
    this.provider?.on('chainChanged', async (chainId: number) => {
      await this.calcAccountData();
    });

    // Subscribe to session disconnection
    this.provider?.on('disconnect', async (code: number, reason: string) => {
      await this.calcAccountData();
    });
  }

  public async connect(): Promise<void> {
    if (this.isActivationInProgress) {
      return;
    }
    this.isActivationInProgress = true;

    // Reset provider for every connection attempt
    const walletConnectProvider = new WalletConnectProvider({
      rpc: this.options!,
    });
    this.provider =
      walletConnectProvider as unknown as MockWalletConnectProvider;
    this.walletConnectProvider = walletConnectProvider;

    try {
      await this.walletConnectProvider?.enable(); // open modal
      this.startListening();
      await this.calcAccountData();
    } catch (e) {
      this.isActivationInProgress = false;
      throw e;
    }
    this.isActivationInProgress = false;
  }

  public async disconnect(): Promise<void> {
    if (this.provider) {
      await this.provider?.disconnect();
      await this.walletConnectProvider?.disconnect();
      this.provider = undefined;
      this.walletConnectProvider = undefined;
      this.isActivationInProgress = false;
      this.account = undefined;
      this.emit('walletAccountChanged', this);
    }
  }

  public async switchChain(chainId: number) {
    if (!this.provider) {
      throw new Error('provider is not defined.');
    }
    return switchChain(this.provider, chainId);
  }

  public async addChain(chainId: number) {
    if (!this.provider) {
      throw new Error('provider is not defined.');
    }
    return addChain(this.provider, chainId);
  }

  public async addToken(chainId: number, token: StaticToken) {
    if (!this.provider) {
      throw new Error('provider is not defined.');
    }
    return switchChainAndAddToken(this.provider, chainId, token);
  }

  private async calcAccountData() {
    if (!this.walletConnectProvider) {
      throw new Error('provider is not defined.');
    }
    const provider = new ethers.providers.Web3Provider(
      this.walletConnectProvider!,
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

import { Web3Provider } from '@ethersproject/providers';
import type { StaticToken } from '@lifi/sdk';
import WalletConnectProvider from '@walletconnect/ethereum-provider';
import type { EthereumProviderOptions } from '@walletconnect/ethereum-provider/dist/types/EthereumProvider';
import { EventEmitter } from 'events';
import type { AccountData, Wallet, WalletConnectConnectorArgs } from '../types';
import {
  addChain,
  switchChain,
  switchChainAndAddToken,
} from '../walletAutomation';

export interface MockWalletConnectProvider
  extends Omit<WalletConnectProvider, 'on' | 'off' | 'once' | 'removeListener'>,
    EventEmitter {}

export class WalletConnectConnector extends EventEmitter implements Wallet {
  private readonly options: EthereumProviderOptions;

  public provider?: MockWalletConnectProvider;

  public walletConnectProvider?: WalletConnectProvider;

  public isActivationInProgress: boolean = false;
  public account?: AccountData;
  public name: string;
  public icon: string;
  public installed: () => Promise<boolean>;

  constructor(args: WalletConnectConnectorArgs) {
    super();
    this.options = args.options;
    this.name = args.name;
    this.icon = args.icon;
    this.installed = args.installed;
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
      // await this.calcAccountData();
    });
  }

  public async connect(): Promise<void> {
    if (this.isActivationInProgress) {
      return;
    }
    this.isActivationInProgress = true;

    this.walletConnectProvider ||= await WalletConnectProvider.init(
      this.options,
    );
    this.provider = this
      .walletConnectProvider as unknown as MockWalletConnectProvider;

    try {
      // Open modal
      await this.walletConnectProvider?.enable();
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
      throw new Error('Provider is not defined.');
    }
    return switchChain(this.walletConnectProvider, chainId);
  }

  public async addChain(chainId: number) {
    if (!this.provider) {
      throw new Error('Provider is not defined.');
    }
    return addChain(this.walletConnectProvider, chainId);
  }

  public async addToken(chainId: number, token: StaticToken) {
    if (!this.provider) {
      throw new Error('Provider is not defined.');
    }
    return switchChainAndAddToken(this.walletConnectProvider, chainId, token);
  }

  private async calcAccountData() {
    if (!this.walletConnectProvider) {
      throw new Error('Provider is not defined.');
    }
    const provider = new Web3Provider(this.walletConnectProvider, 'any');

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

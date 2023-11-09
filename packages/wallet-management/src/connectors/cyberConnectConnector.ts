import type { Web3Provider } from '@ethersproject/providers';
import { CyberApp, CyberProvider } from '@cyberlab/cyber-app-sdk';
import { EventEmitter } from 'events';
import type { AccountData, InjectedConnectorArgs, Wallet } from '../types';
import { InjectedConnector } from 'wagmi/connectors/injected';
import { providers } from 'ethers';

const ARBITRUM_CHAIN_ID = 42161;

export class CyberConnectConnector extends EventEmitter implements Wallet {
  public provider: Web3Provider | undefined;

  public isActivationInProgress: boolean = false;
  public account: AccountData | undefined;

  public name: string;
  public icon: string;
  public installed: () => Promise<boolean>;

  constructor(args: InjectedConnectorArgs) {
    super();
    this.name = args.name;
    this.icon = args.icon;
    this.installed = args.installed;

    this.calcAccountData();
  }

  public autoConnect = async () => {
    await this.calcAccountData();
  };

  public disconnect = () => {
    this.account = undefined;
  };

  public connect = async () => {
    await this.calcAccountData();
  };

  private async calcAccountData(currentChainId = ARBITRUM_CHAIN_ID) {
    const cyberApp = new CyberApp({
      name: 'LI.FI',
      icon: 'https://github.com/lifinance/types/blob/main/src/assets/icons/bridges/lifuel.png',
    });

    const cyberProvider = new CyberProvider({
      app: cyberApp,
      chainId: currentChainId,
    });

    const injectedConnector = new InjectedConnector({
      options: {
        name: 'CyberWallet',
        getProvider: () => {
          return cyberProvider;
        },
      },
    });

    const walletClient = await injectedConnector.getWalletClient({
      chainId: currentChainId,
    });

    const { account, transport } = walletClient;

    const provider = new providers.Web3Provider(transport, 'any');
    const signer = provider.getSigner(account.address);

    this.account = {
      chainId: currentChainId,
      address: account.address,
      signer,
      provider,
      isMultisigWallet: true,
    };
    this.emit('walletAccountChanged', this);
  }

  public switchChain = async (chainId: number): Promise<any> => {
    return this.calcAccountData(chainId);
  };
  public addChain = (): any => {
    console.warn('Method addChain not allowed');
    return null;
  };
  public addToken = (): any => {
    console.warn('Method addToken not allowed');
    return null;
  };
}

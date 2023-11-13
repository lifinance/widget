import { Web3Provider } from '@ethersproject/providers';
import { CyberApp, CyberProvider } from '@cyberlab/cyber-app-sdk';
import { EventEmitter } from 'events';
import type { AccountData, InjectedConnectorArgs, Wallet } from '../types';

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
      appId: 'jumper.exchange',
      name: 'Jumper.Exchange',
      icon: 'https://raw.githubusercontent.com/lifinance/jumper.exchange/e9ead2e32981db0bf47adf2b1b2781e31ad14650/packages/dapp/public/logo-144x144.svg',
    });

    const cyberProvider = new CyberProvider({
      app: cyberApp,
      chainId: currentChainId,
    });

    const provider = new Web3Provider(cyberProvider, 'any');
    const signer = provider.getSigner();

    this.account = {
      chainId: currentChainId,
      address: await signer.getAddress(),
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

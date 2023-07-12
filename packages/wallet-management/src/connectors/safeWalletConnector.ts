import { Web3Provider } from '@ethersproject/providers';
import { SafeAppProvider } from '@safe-global/safe-apps-provider';
import type { SafeInfo } from '@safe-global/safe-apps-sdk';
import SafeAppsSDK from '@safe-global/safe-apps-sdk';
import events from 'events';
import type { AccountData, InjectedConnectorArgs, Wallet } from '../types';

export class SafeWalletConnector extends events.EventEmitter implements Wallet {
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

  private async calcAccountData() {
    const sdk = new SafeAppsSDK();
    const accountInfo = await sdk.safe.getInfo();

    const safe: SafeInfo = {
      safeAddress: accountInfo.safeAddress,
      chainId: accountInfo.chainId,
      threshold: accountInfo.threshold,
      owners: accountInfo.owners,
      isReadOnly: accountInfo.isReadOnly,
    };

    const safeInstance = new SafeAppProvider(safe, sdk);

    const provider = new Web3Provider(safeInstance);
    const signer = provider.getSigner();

    this.account = {
      chainId: accountInfo.chainId,
      address: accountInfo.safeAddress,
      signer,
      provider,
      isMultisigWallet: true,
    };
    this.emit('walletAccountChanged', this);
  }

  public switchChain = (): any => {
    console.warn('Method switchChain not allowed');
    return null;
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

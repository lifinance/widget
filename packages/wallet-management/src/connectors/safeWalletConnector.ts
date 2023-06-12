import { ethers } from 'ethers';
import events from 'events';
import type {
  AccountData,
  InjectedConnectorConstructorArgs,
  Wallet,
} from '../types';

import type { SafeInfo } from '@safe-global/safe-apps-sdk';
import { SafeAppProvider } from '@safe-global/safe-apps-provider';
import SafeAppsSDK from '@safe-global/safe-apps-sdk/dist/src/sdk';

export class SafeWalletConnector
  extends events.EventEmitter
  implements Partial<Wallet>
{
  public provider: ethers.providers.Web3Provider | undefined;

  public isActivationInProgress: boolean = false;
  public account: AccountData | undefined;

  public name: string;
  public icon: string;

  constructor(args: InjectedConnectorConstructorArgs) {
    super();
    this.name = args.name;
    this.icon = args.icon;

    this.calcAccountData();
  }

  public installed = () => {
    return false;
  };
  public autoConnect = (): any => {
    console.warn('Method not allowed');
    return null;
  };
  public disconnect = () => {
    console.warn('Method not allowed');
    return null;
  };
  public switchChain = (): any => {
    console.warn('Method not allowed');
    return null;
  };
  public addChain = (): any => {
    console.warn('Method not allowed');
    return null;
  };
  public addToken = (): any => {
    console.warn('Method not allowed');
    return null;
  };

  public connect = (): any => {
    console.warn('Method not allowed');
    return null;
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

    const provider = new ethers.providers.Web3Provider(safeInstance);
    const signer = provider.getSigner();

    this.account = {
      chainId: accountInfo.chainId,
      address: accountInfo.safeAddress,
      signer,
      provider,
      isSafeWallet: true,
      sdk,
    };
  }
}

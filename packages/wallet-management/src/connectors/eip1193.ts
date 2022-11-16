// eslint-disable-next-line max-classes-per-file
import { Eip1193Bridge } from '@ethersproject/experimental';
import { Web3Provider } from '@ethersproject/providers';
import { initializeConnector } from '@web3-react/core';
import type { EIP1193ConstructorArgs } from '@web3-react/eip1193';
import { EIP1193 } from '@web3-react/eip1193';
import type { Empty } from '@web3-react/empty';
import { EMPTY } from '@web3-react/empty';
import type { ProviderConnectInfo, ProviderRpcError } from '@web3-react/types';

class Eip1193BridgeWithoutAccounts extends Eip1193Bridge {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  request(request: { method: string; params?: any[] }): Promise<any> {
    return super.request(request);
  }
}
class EIP1193Listener extends EIP1193 {
  constructor({ actions, provider, onError }: EIP1193ConstructorArgs) {
    super({ actions, provider, onError });

    this.provider = provider;

    this.provider.on('connect', ({ chainId }: ProviderConnectInfo): void => {
      console.log('connect:', chainId);
    });

    this.provider.on('disconnect', (error: ProviderRpcError): void => {
      this.actions.resetState();
      this.onError?.(error);
    });

    this.provider.on('chainChanged', (chainId: string): void => {
      console.log(chainId);
    });

    this.provider.on('accountsChanged', (accounts: string[]): void => {
      console.log('eip1193 accounts', accounts);
    });
  }
}

export const createEip1193Connector = () => {
  const { ethereum } = window as any;
  const currentProvider = ethereum ? new Web3Provider(ethereum) : null;

  const eip1193Provider = new Eip1193BridgeWithoutAccounts(
    currentProvider!.getSigner(),
    currentProvider!,
  );
  const [eip1193, hooks] = initializeConnector<EIP1193Listener | Empty>(
    (actions) =>
      eip1193Provider
        ? new EIP1193({
            actions,
            provider: eip1193Provider,
            onError: (error) => console.warn(error),
          })
        : EMPTY,
    // supportedChains.map((chain) => chain.id),
  );

  console.log('eip1193:', eip1193);

  return {
    connector: eip1193,
    hooks,
  };
};

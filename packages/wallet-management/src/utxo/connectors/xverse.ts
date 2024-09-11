import {
  ChainId,
  type BtcAccount,
  type SignPsbtParameters,
  type UTXOWalletProvider,
} from '@lifi/sdk';
import {
  MethodNotSupportedRpcError,
  UserRejectedRequestError,
  type Address,
} from 'viem';
import { createConnector, ProviderNotFoundError } from 'wagmi';
import type { UTXOConnectorParameters } from './types.js';

export type XverseBitcoinEventMap = {
  accountChange(accounts: BtcAccount[]): void;
};

export type XverseBitcoinEvents = {
  addListener<TEvent extends keyof XverseBitcoinEventMap>(
    event: TEvent,
    listener: XverseBitcoinEventMap[TEvent],
  ): void;
  removeListener?<TEvent extends keyof XverseBitcoinEventMap>(
    event: TEvent,
    listener: XverseBitcoinEventMap[TEvent],
  ): void;
};

type XverseConnectorProperties = {
  getAccounts(): Promise<readonly (BtcAccount | Address)[]>;
  onAccountsChanged(accounts: (BtcAccount | Address)[]): void;
  getInternalProvider(): Promise<XverseBitcoinProvider>;
} & UTXOWalletProvider;

type Purpose = 'ordinals' | 'payment' | 'stacks';

type Error = { code: number; message: string };

// Define the shape of the request parameters
interface GetAccountsRequest {
  purposes: Purpose[];
}

interface GetAccountsResponse {
  result?: { addresses: BtcAccount[] };
  error?: Error;
}

interface RequestPermissionsResponse {
  result?: boolean;
  error?: Error;
}

type XverseBitcoinProvider = {
  request(
    method: 'signPsbt',
    options: {
      psbt: string;
      allowedSignHash: number;
      signInputs: Record<string, number[]>;
      broadcast: boolean;
    },
  ): Promise<string>;
  request(
    method: 'getAccounts' | 'getAddresses',
    options: GetAccountsRequest,
  ): Promise<GetAccountsResponse>;
  request(
    method: 'wallet_requestPermissions' | 'wallet_renouncePermissions',
  ): Promise<RequestPermissionsResponse>;
} & XverseBitcoinEvents;

xverse.type = 'UTXO' as const;
export function xverse(parameters: UTXOConnectorParameters = {}) {
  const { chainId, shimDisconnect = true } = parameters;
  let accountChange: ((accounts: BtcAccount[]) => void) | undefined;
  return createConnector<
    UTXOWalletProvider | undefined,
    XverseConnectorProperties
  >((config) => ({
    id: 'XverseProviders.BitcoinProvider',
    name: 'Xverse Wallet',
    type: xverse.type,
    icon: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MDAiIGhlaWdodD0iNjAwIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGZpbGw9IiMxNzE3MTciIGQ9Ik0wIDBoNjAwdjYwMEgweiIvPjxwYXRoIGZpbGw9IiNGRkYiIGZpbGwtcnVsZT0ibm9uemVybyIgZD0iTTQ0MCA0MzUuNHYtNTFjMC0yLS44LTMuOS0yLjItNS4zTDIyMCAxNjIuMmE3LjYgNy42IDAgMCAwLTUuNC0yLjJoLTUxLjFjLTIuNSAwLTQuNiAyLTQuNiA0LjZ2NDcuM2MwIDIgLjggNCAyLjIgNS40bDc4LjIgNzcuOGE0LjYgNC42IDAgMCAxIDAgNi41bC03OSA3OC43Yy0xIC45LTEuNCAyLTEuNCAzLjJ2NTJjMCAyLjQgMiA0LjUgNC42IDQuNUgyNDljMi42IDAgNC42LTIgNC42LTQuNlY0MDVjMC0xLjIuNS0yLjQgMS40LTMuM2w0Mi40LTQyLjJhNC42IDQuNiAwIDAgMSA2LjQgMGw3OC43IDc4LjRhNy42IDcuNiAwIDAgMCA1LjQgMi4yaDQ3LjVjMi41IDAgNC42LTIgNC42LTQuNloiLz48cGF0aCBmaWxsPSIjRUU3QTMwIiBmaWxsLXJ1bGU9Im5vbnplcm8iIGQ9Ik0zMjUuNiAyMjcuMmg0Mi44YzIuNiAwIDQuNiAyLjEgNC42IDQuNnY0Mi42YzAgNCA1IDYuMSA4IDMuMmw1OC43LTU4LjVjLjgtLjggMS4zLTIgMS4zLTMuMnYtNTEuMmMwLTIuNi0yLTQuNi00LjYtNC42TDM4NCAxNjBjLTEuMiAwLTIuNC41LTMuMyAxLjNsLTU4LjQgNTguMWE0LjYgNC42IDAgMCAwIDMuMiA3LjhaIi8+PC9nPjwvc3ZnPg==',
    async setup() {
      //
    },
    async getInternalProvider() {
      if (typeof window === 'undefined') {
        return undefined;
      }
      if ('XverseProviders' in window) {
        const anyWindow: any = window;
        const provider = anyWindow.XverseProviders.BitcoinProvider;
        return provider;
      }
    },
    async getProvider() {
      const internalProvider = await this.getInternalProvider();
      if (!internalProvider) {
        return;
      }
      const provider = {
        request: this.request.bind(internalProvider),
      };
      return provider;
    },
    async request(
      this: XverseBitcoinProvider | any,
      { method, params },
    ): Promise<any> {
      switch (method) {
        case 'signPsbt':
          const { psbt, ...options } = params as SignPsbtParameters;
          const psbtBase64 = btoa(
            psbt
              .match(/.{1,2}/g)!
              .map((byte) => String.fromCharCode(parseInt(byte, 16)))
              .join(''),
          );
          const signInputs = options.inputsToSign.reduce(
            (signInputs, input) => {
              if (!signInputs[input.address]) {
                signInputs[input.address] = [];
              }
              signInputs[input.address].push(...input.signingIndexes);
              return signInputs;
            },
            {} as Record<string, number[]>,
          );
          const signedPsbt = await this.request('signPsbt', {
            psbt: psbtBase64,
            allowedSignHash: 1, // Default to Transaction.SIGHASH_ALL - 1
            signInputs: signInputs,
            broadcast: options.finalize,
          });
          if (signedPsbt?.error) {
            throw signedPsbt?.error;
          }
          return signedPsbt;
        default:
          throw new MethodNotSupportedRpcError(
            new Error(MethodNotSupportedRpcError.name),
            {
              method,
            },
          );
      }
    },
    async connect({ isReconnecting } = {}) {
      const provider = await this.getInternalProvider();
      if (!provider) {
        throw new ProviderNotFoundError();
      }

      if (!isReconnecting) {
        const connected = await provider.request('wallet_requestPermissions');

        if (connected.error) {
          throw new UserRejectedRequestError({
            name: UserRejectedRequestError.name,
            message: connected.error.message,
          });
        }
      }

      const accounts = await this.getAccounts();
      const chainId = await this.getChainId();

      if (!accountChange) {
        accountChange = this.onAccountsChanged.bind(this);
        provider.addListener('accountChange', accountChange);
      }

      // Remove disconnected shim if it exists
      if (shimDisconnect) {
        await Promise.all([
          config.storage?.setItem(`${this.id}.connected`, true),
          config.storage?.removeItem(`${this.id}.disconnected`),
        ]);
      }

      return { accounts, chainId };
    },
    async disconnect() {
      const provider = await this.getInternalProvider();
      if (!provider) {
        throw new ProviderNotFoundError();
      }
      if (accountChange) {
        provider.removeListener?.('accountChange', accountChange);
        accountChange = undefined;
      }

      // await provider.request('wallet_renouncePermissions').catch();

      // Add shim signalling connector is disconnected
      if (shimDisconnect) {
        await Promise.all([
          config.storage?.setItem(`${this.id}.disconnected`, true),
          config.storage?.removeItem(`${this.id}.connected`),
        ]);
      }
    },
    async getAccounts() {
      const provider = await this.getInternalProvider();
      if (!provider) {
        throw new ProviderNotFoundError();
      }
      const accounts = await provider.request('getAddresses', {
        purposes: ['payment'],
      });
      if (!accounts.result) {
        throw new UserRejectedRequestError({
          name: UserRejectedRequestError.name,
          message: accounts.error?.message!,
        });
      }
      return accounts.result.addresses.map(
        (account) => account.address as Address,
      );
    },
    async getChainId() {
      return chainId || ChainId.BTC;
    },
    async isAuthorized() {
      try {
        const isConnected =
          shimDisconnect &&
          // If shim exists in storage, connector is disconnected
          Boolean(await config.storage?.getItem(`${this.id}.connected`));
        return isConnected;
      } catch {
        return false;
      }
    },
    async onAccountsChanged() {
      const { accounts } = await this.connect();
      config.emitter.emit('change', {
        accounts,
      });
    },
    onChainChanged(chain) {
      const chainId = Number(chain);
      config.emitter.emit('change', { chainId });
    },
    async onDisconnect(error) {
      config.emitter.emit('disconnect');
    },
  }));
}

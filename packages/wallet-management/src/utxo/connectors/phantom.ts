import {
  ChainId,
  type BtcAccount,
  type SignPsbtParameters,
  type UTXOWalletProvider,
} from '@lifi/sdk';
import {
  MethodNotSupportedRpcError,
  UserRejectedRequestError,
  withRetry,
  type Address,
} from 'viem';
import { createConnector, ProviderNotFoundError } from 'wagmi';
import type { UTXOConnectorParameters } from './types.js';

export type PhantomBitcoinEventMap = {
  accountsChanged(accounts: BtcAccount[]): void;
};

export type PhantomBitcoinEvents = {
  on<TEvent extends keyof PhantomBitcoinEventMap>(
    event: TEvent,
    listener: PhantomBitcoinEventMap[TEvent],
  ): void;
  removeListener<TEvent extends keyof PhantomBitcoinEventMap>(
    event: TEvent,
    listener: PhantomBitcoinEventMap[TEvent],
  ): void;
};

type PhantomConnectorProperties = {
  getAccounts(): Promise<readonly (BtcAccount | Address)[]>;
  onAccountsChanged(accounts: (BtcAccount | Address)[]): void;
  getInternalProvider(): Promise<PhantomBitcoinProvider>;
} & UTXOWalletProvider;

type PhantomBitcoinProvider = {
  requestAccounts(): Promise<BtcAccount[]>;
  signPSBT(
    psbtHex: Uint8Array,
    options: {
      inputsToSign: {
        sigHash?: number | undefined;
        address: string;
        signingIndexes: number[];
      }[];
      finalize?: boolean;
    },
  ): Promise<Uint8Array>;
} & PhantomBitcoinEvents;

phantom.type = 'UTXO' as const;
export function phantom(parameters: UTXOConnectorParameters = {}) {
  const { chainId, shimDisconnect = true } = parameters;
  let accountsChanged: ((accounts: BtcAccount[]) => void) | undefined;
  return createConnector<
    UTXOWalletProvider | undefined,
    PhantomConnectorProperties
  >((config) => ({
    id: 'app.phantom.bitcoin',
    name: 'Phantom',
    type: phantom.type,
    icon: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTA4IiBoZWlnaHQ9IjEwOCIgdmlld0JveD0iMCAwIDEwOCAxMDgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDgiIGhlaWdodD0iMTA4IiByeD0iMjYiIGZpbGw9IiNBQjlGRjIiLz4KPHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik00Ni41MjY3IDY5LjkyMjlDNDIuMDA1NCA3Ni44NTA5IDM0LjQyOTIgODUuNjE4MiAyNC4zNDggODUuNjE4MkMxOS41ODI0IDg1LjYxODIgMTUgODMuNjU2MyAxNSA3NS4xMzQyQzE1IDUzLjQzMDUgNDQuNjMyNiAxOS44MzI3IDcyLjEyNjggMTkuODMyN0M4Ny43NjggMTkuODMyNyA5NCAzMC42ODQ2IDk0IDQzLjAwNzlDOTQgNTguODI1OCA4My43MzU1IDc2LjkxMjIgNzMuNTMyMSA3Ni45MTIyQzcwLjI5MzkgNzYuOTEyMiA2OC43MDUzIDc1LjEzNDIgNjguNzA1MyA3Mi4zMTRDNjguNzA1MyA3MS41NzgzIDY4LjgyNzUgNzAuNzgxMiA2OS4wNzE5IDY5LjkyMjlDNjUuNTg5MyA3NS44Njk5IDU4Ljg2ODUgODEuMzg3OCA1Mi41NzU0IDgxLjM4NzhDNDcuOTkzIDgxLjM4NzggNDUuNjcxMyA3OC41MDYzIDQ1LjY3MTMgNzQuNDU5OEM0NS42NzEzIDcyLjk4ODQgNDUuOTc2OCA3MS40NTU2IDQ2LjUyNjcgNjkuOTIyOVpNODMuNjc2MSA0Mi41Nzk0QzgzLjY3NjEgNDYuMTcwNCA4MS41NTc1IDQ3Ljk2NTggNzkuMTg3NSA0Ny45NjU4Qzc2Ljc4MTYgNDcuOTY1OCA3NC42OTg5IDQ2LjE3MDQgNzQuNjk4OSA0Mi41Nzk0Qzc0LjY5ODkgMzguOTg4NSA3Ni43ODE2IDM3LjE5MzEgNzkuMTg3NSAzNy4xOTMxQzgxLjU1NzUgMzcuMTkzMSA4My42NzYxIDM4Ljk4ODUgODMuNjc2MSA0Mi41Nzk0Wk03MC4yMTAzIDQyLjU3OTVDNzAuMjEwMyA0Ni4xNzA0IDY4LjA5MTYgNDcuOTY1OCA2NS43MjE2IDQ3Ljk2NThDNjMuMzE1NyA0Ny45NjU4IDYxLjIzMyA0Ni4xNzA0IDYxLjIzMyA0Mi41Nzk1QzYxLjIzMyAzOC45ODg1IDYzLjMxNTcgMzcuMTkzMSA2NS43MjE2IDM3LjE5MzFDNjguMDkxNiAzNy4xOTMxIDcwLjIxMDMgMzguOTg4NSA3MC4yMTAzIDQyLjU3OTVaIiBmaWxsPSIjRkZGREY4Ii8+Cjwvc3ZnPgo=',
    async setup() {
      //
    },
    async getInternalProvider() {
      if (typeof window === 'undefined') {
        return;
      }
      if ('phantom' in window) {
        const anyWindow: any = window;
        const internalProvider = anyWindow.phantom?.bitcoin;

        if (internalProvider && internalProvider.isPhantom) {
          return internalProvider;
        }
      }
      // TODO: https://docs.phantom.app/phantom-deeplinks/deeplinks-ios-and-android
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
      this: PhantomBitcoinProvider,
      { method, params },
    ): Promise<any> {
      switch (method) {
        case 'signPsbt':
          const { psbt, ...options } = params as SignPsbtParameters;
          const psbtUint8Array = new Uint8Array(
            psbt.match(/.{1,2}/g)!.map((byte) => parseInt(byte, 16)),
          );
          const signedPsbt = await this.signPSBT(psbtUint8Array, {
            inputsToSign: options.inputsToSign,
            finalize: options.finalize,
          });
          const signedPsbtHex = Array.from(signedPsbt, (byte) =>
            byte.toString(16).padStart(2, '0'),
          ).join('');
          return signedPsbtHex;
        default:
          throw new MethodNotSupportedRpcError(
            new Error(MethodNotSupportedRpcError.name),
            {
              method,
            },
          );
      }
    },
    async connect() {
      const provider = await this.getInternalProvider();
      if (!provider) {
        throw new ProviderNotFoundError();
      }
      try {
        const accounts = await this.getAccounts();
        const chainId = await this.getChainId();

        if (!accountsChanged) {
          accountsChanged = this.onAccountsChanged.bind(this);
          provider.on('accountsChanged', accountsChanged);
        }

        // Remove disconnected shim if it exists
        if (shimDisconnect) {
          await config.storage?.removeItem(`${this.id}.disconnected`);
        }
        return { accounts, chainId };
      } catch (error: any) {
        throw new UserRejectedRequestError({
          name: UserRejectedRequestError.name,
          message: error.message,
        });
      }
    },
    async disconnect() {
      const provider = await this.getInternalProvider();

      if (accountsChanged) {
        provider?.removeListener('accountsChanged', accountsChanged);
        accountsChanged = undefined;
      }

      // Add shim signalling connector is disconnected
      if (shimDisconnect) {
        await config.storage?.setItem(`${this.id}.disconnected`, true);
      }
    },
    async getAccounts() {
      const provider = await this.getInternalProvider();
      if (!provider) {
        throw new ProviderNotFoundError();
      }
      const accounts = await provider.requestAccounts();
      return accounts
        .filter((account) => account.purpose === 'payment')
        .map((account) => account.address as Address);
    },
    async getChainId() {
      return chainId || ChainId.BTC;
    },
    async isAuthorized() {
      try {
        const isDisconnected =
          shimDisconnect &&
          // If shim exists in storage, connector is disconnected
          (await config.storage?.getItem(`${this.id}.disconnected`));
        if (isDisconnected) {
          return false;
        }
        const accounts = await withRetry(() => this.getAccounts());
        return !!accounts.length;
      } catch {
        return false;
      }
    },
    async onAccountsChanged(accounts) {
      if (accounts.length === 0) {
        this.onDisconnect();
      } else {
        config.emitter.emit('change', {
          accounts: accounts
            .filter((account) => (account as BtcAccount).purpose === 'payment')
            .map((account) => (account as BtcAccount).address as Address),
        });
      }
    },
    onChainChanged(chain) {
      const chainId = Number(chain);
      config.emitter.emit('change', { chainId });
    },
    async onDisconnect(error) {
      // No need to remove `${this.id}.disconnected` from storage because `onDisconnect` is typically
      // only called when the wallet is disconnected through the wallet's interface, meaning the wallet
      // actually disconnected and we don't need to simulate it.
      config.emitter.emit('disconnect');
    },
  }));
}

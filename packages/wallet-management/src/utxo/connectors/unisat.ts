import {
  ChainId,
  type SignPsbtParameters,
  type UTXOWalletProvider,
} from '@lifi/sdk';
import {
  type Address,
  MethodNotSupportedRpcError,
  UserRejectedRequestError,
  withRetry,
} from 'viem';
import { createConnector, ProviderNotFoundError } from 'wagmi';
import type { UTXOConnectorParameters } from './types.js';

export type UnisatBitcoinEventMap = {
  accountsChanged(accounts: Address[]): void;
};

export type UnisatBitcoinEvents = {
  addListener<TEvent extends keyof UnisatBitcoinEventMap>(
    event: TEvent,
    listener: UnisatBitcoinEventMap[TEvent],
  ): void;
  removeListener<TEvent extends keyof UnisatBitcoinEventMap>(
    event: TEvent,
    listener: UnisatBitcoinEventMap[TEvent],
  ): void;
};

type UnisatConnectorProperties = {
  getAccounts(): Promise<readonly Address[]>;
  onAccountsChanged(accounts: Address[]): void;
  getInternalProvider(): Promise<UnisatBitcoinProvider>;
} & UTXOWalletProvider;

type UnisatBitcoinProvider = {
  requestAccounts(): Promise<Address[]>;
  getAccounts(): Promise<Address[]>;
  signPsbt(
    psbtHex: string,
    options: {
      toSignInputs: {
        index: number;
        address: string;
        sighashTypes?: number[];
      }[];
      autoFinalized?: boolean;
    },
  ): Promise<string>;
} & UnisatBitcoinEvents;

unisat.type = 'UTXO' as const;
export function unisat(parameters: UTXOConnectorParameters = {}) {
  const { chainId, shimDisconnect = true } = parameters;
  let accountsChanged: ((accounts: Address[]) => void) | undefined;
  return createConnector<
    UTXOWalletProvider | undefined,
    UnisatConnectorProperties
  >((config) => ({
    id: 'unisat',
    name: 'Unisat',
    type: unisat.type,
    icon: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGRhdGEtbmFtZT0i5Zu+5bGCIDIiIHZpZXdCb3g9IjAgMCAxMTUuNzcgMTQ3LjciPjxkZWZzPjxsaW5lYXJHcmFkaWVudCBpZD0iYSIgeDE9IjMzNzkuMDMiIHgyPSIzNDE1LjQ4IiB5MT0iLTIxMDIiIHkyPSItMjE5OC4xMSIgZGF0YS1uYW1lPSLmnKrlkb3lkI3nmoTmuJDlj5ggNSIgZ3JhZGllbnRUcmFuc2Zvcm09InJvdGF0ZSgtMTM0LjczIDIxODcuNjY3IC0zNTMuNDI3KSIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPjxzdG9wIG9mZnNldD0iMCIgc3RvcC1jb2xvcj0iIzIwMWMxYiIvPjxzdG9wIG9mZnNldD0iLjM2IiBzdG9wLWNvbG9yPSIjNzczOTBkIi8+PHN0b3Agb2Zmc2V0PSIuNjciIHN0b3AtY29sb3I9IiNlYTgxMDEiLz48c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiNmNGI4NTIiLz48L2xpbmVhckdyYWRpZW50PjxsaW5lYXJHcmFkaWVudCBpZD0iYiIgeDE9IjMzODQuMjMiIHgyPSIzMzMwLjY0IiB5MT0iLTIyMzEuNDIiIHkyPSItMjEzMS4yOSIgZGF0YS1uYW1lPSLmnKrlkb3lkI3nmoTmuJDlj5ggNCIgZ3JhZGllbnRUcmFuc2Zvcm09InJvdGF0ZSgtMTM0LjczIDIxODcuNjY3IC0zNTMuNDI3KSIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPjxzdG9wIG9mZnNldD0iMCIgc3RvcC1jb2xvcj0iIzFmMWQxYyIvPjxzdG9wIG9mZnNldD0iLjM3IiBzdG9wLWNvbG9yPSIjNzczOTBkIi8+PHN0b3Agb2Zmc2V0PSIuNjciIHN0b3AtY29sb3I9IiNlYTgxMDEiLz48c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiNmNGZiNTIiLz48L2xpbmVhckdyYWRpZW50PjxyYWRpYWxHcmFkaWVudCBpZD0iYyIgY3g9IjUzLjAxIiBjeT0iNDUuODQiIHI9IjExLjEzIiBkYXRhLW5hbWU9IuacquWRveWQjeeahOa4kOWPmCA2IiBmeD0iNTMuMDEiIGZ5PSI0NS44NCIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPjxzdG9wIG9mZnNldD0iMCIgc3RvcC1jb2xvcj0iI2Y0Yjg1MiIvPjxzdG9wIG9mZnNldD0iLjMzIiBzdG9wLWNvbG9yPSIjZWE4MTAxIi8+PHN0b3Agb2Zmc2V0PSIuNjQiIHN0b3AtY29sb3I9IiM3NzM5MGQiLz48c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiMyMTFjMWQiLz48L3JhZGlhbEdyYWRpZW50PjwvZGVmcz48ZyBkYXRhLW5hbWU9IuWbvuWxgiAxIj48cGF0aCBmaWxsPSJ1cmwoI2EpIiBkPSJtODEuNjYgMTMuMjkgMzAuMzEgMzAuMDJjMi41OCAyLjU1IDMuODUgNS4xMyAzLjgxIDcuNzMtLjA0IDIuNi0xLjE1IDQuOTctMy4zMiA3LjEyLTIuMjcgMi4yNS00LjcyIDMuMzktNy4zNCAzLjQ0LTIuNjIuMDQtNS4yMi0xLjIyLTcuOC0zLjc3bC0zMS0zMC43Yy0zLjUyLTMuNDktNi45Mi01Ljk2LTEwLjE5LTcuNDEtMy4yNy0xLjQ1LTYuNzEtMS42OC0xMC4zMS0uNjgtMy42MS45OS03LjQ4IDMuNTQtMTEuNjMgNy42NC01LjcyIDUuNjctOC40NSAxMC45OS04LjE3IDE1Ljk2LjI4IDQuOTcgMy4xMiAxMC4xMyA4LjUxIDE1LjQ2bDMxLjI1IDMwLjk2YzIuNjEgMi41OCAzLjg5IDUuMTYgMy44NSA3LjcyLS4wNCAyLjU3LTEuMTYgNC45NC0zLjM3IDcuMTMtMi4yIDIuMTgtNC42MyAzLjMyLTcuMjcgMy40MS0yLjY0LjA5LTUuMjctMS4xNi03Ljg3LTMuNzRMMjAuODEgNzMuNTZjLTQuOTMtNC44OC04LjQ5LTkuNS0xMC42OC0xMy44Ni0yLjE5LTQuMzYtMy4wMS05LjI5LTIuNDQtMTQuNzkuNTEtNC43MSAyLjAyLTkuMjcgNC41NC0xMy42OSAyLjUxLTQuNDIgNi4xMS04Ljk0IDEwLjc4LTEzLjU3IDUuNTYtNS41MSAxMC44Ny05LjczIDE1LjkzLTEyLjY3QzQzLjk5IDIuMDQgNDguODguNDEgNTMuNi4wN2M0LjczLS4zNCA5LjM5LjYgMTQgMi44MiA0LjYxIDIuMjIgOS4yOSA1LjY4IDE0LjA1IDEwLjRaIi8+PHBhdGggZmlsbD0idXJsKCNiKSIgZD0iTTM0LjExIDEzNC40MiAzLjgxIDEwNC40QzEuMjMgMTAxLjg0LS4wNCA5OS4yNyAwIDk2LjY3Yy4wNC0yLjYgMS4xNS00Ljk3IDMuMzItNy4xMiAyLjI3LTIuMjUgNC43Mi0zLjM5IDcuMzQtMy40NCAyLjYyLS4wNCA1LjIyIDEuMjEgNy44IDMuNzdsMzAuOTkgMzAuN2MzLjUzIDMuNDkgNi45MiA1Ljk2IDEwLjE5IDcuNDEgMy4yNyAxLjQ1IDYuNzEgMS42NyAxMC4zMi42OCAzLjYxLS45OSA3LjQ4LTMuNTQgMTEuNjMtNy42NSA1LjcyLTUuNjcgOC40NS0xMC45OSA4LjE3LTE1Ljk2LS4yOC00Ljk3LTMuMTItMTAuMTMtOC41MS0xNS40N0w2NC42IDczLjI0Yy0yLjYxLTIuNTgtMy44OS01LjE2LTMuODUtNy43Mi4wNC0yLjU3IDEuMTYtNC45NCAzLjM3LTcuMTMgMi4yLTIuMTggNC42My0zLjMyIDcuMjctMy40MSAyLjY0LS4wOSA1LjI3IDEuMTYgNy44NyAzLjc0bDE1LjcgMTUuNDFjNC45MyA0Ljg4IDguNDkgOS41IDEwLjY4IDEzLjg2IDIuMTkgNC4zNiAzLjAxIDkuMjkgMi40NCAxNC43OS0uNTEgNC43MS0yLjAyIDkuMjctNC41NCAxMy42OS0yLjUxIDQuNDItNi4xMSA4Ljk0LTEwLjc4IDEzLjU3LTUuNTYgNS41MS0xMC44NyA5LjczLTE1LjkzIDEyLjY3LTUuMDYgMi45NC05Ljk1IDQuNTgtMTQuNjggNC45Mi00LjczLjM0LTkuMzktLjYtMTQtMi44Mi00LjYxLTIuMjItOS4yOS01LjY4LTE0LjA1LTEwLjRaIi8+PGNpcmNsZSBjeD0iNTMuMDEiIGN5PSI0NS44MyIgcj0iMTEuMTMiIGZpbGw9InVybCgjYykiLz48L2c+PC9zdmc+',
    async setup() {
      //
    },
    async getInternalProvider() {
      if (typeof window === 'undefined') {
        return;
      }
      if ('unisat' in window) {
        const anyWindow: any = window;
        return anyWindow.unisat;
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
      this: UnisatBitcoinProvider,
      { method, params },
    ): Promise<any> {
      switch (method) {
        case 'signPsbt':
          const { psbt, ...options } = params as SignPsbtParameters;
          const toSignInputs = options.inputsToSign.flatMap(
            ({ sigHash, address, signingIndexes }) =>
              signingIndexes.map((index) => ({
                index,
                address,
                sighashTypes: sigHash !== undefined ? [sigHash] : undefined,
              })),
          );
          const signedPsbt = await this.signPsbt(psbt, {
            toSignInputs,
            autoFinalized: options.finalize,
          });
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
    async connect() {
      const provider = await this.getInternalProvider();
      if (!provider) {
        throw new ProviderNotFoundError();
      }
      try {
        const accounts = await provider.requestAccounts();
        const chainId = await this.getChainId();

        if (!accountsChanged) {
          accountsChanged = this.onAccountsChanged.bind(this);
          provider.addListener('accountsChanged', accountsChanged);
        }

        // Remove disconnected shim if it exists
        if (shimDisconnect) {
          await Promise.all([
            config.storage?.setItem(`${this.id}.connected`, true),
            config.storage?.removeItem(`${this.id}.disconnected`),
          ]);
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
      const accounts = await provider.getAccounts();
      return accounts as Address[];
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
          accounts: accounts as Address[],
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

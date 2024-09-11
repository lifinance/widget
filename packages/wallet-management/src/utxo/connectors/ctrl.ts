import {
  ChainId,
  type SignPsbtParameters,
  type UTXOWalletProvider,
} from '@lifi/sdk';
import {
  type Address,
  MethodNotSupportedRpcError,
  UserRejectedRequestError,
} from 'viem';
import { createConnector, ProviderNotFoundError } from 'wagmi';
import type { UTXOConnectorParameters } from './types.js';

export type CtrlBitcoinEventMap = {
  accountsChanged(accounts: Address[]): void;
};

export type CtrlBitcoinEvents = {
  addListener<TEvent extends keyof CtrlBitcoinEventMap>(
    event: TEvent,
    listener: CtrlBitcoinEventMap[TEvent],
  ): void;
  removeListener<TEvent extends keyof CtrlBitcoinEventMap>(
    event: TEvent,
    listener: CtrlBitcoinEventMap[TEvent],
  ): void;
};

type CtrlConnectorProperties = {
  getAccounts(): Promise<readonly Address[]>;
  onAccountsChanged(accounts: Address[]): void;
  getInternalProvider(): Promise<CtrlBitcoinProvider>;
} & UTXOWalletProvider;

type CtrlBitcoinProvider = {
  requestAccounts(): Promise<Address[]>;
  getAccounts(): Promise<Address[]>;
  signPsbt(psbtHex: string, finalise?: boolean): Promise<string>;
} & CtrlBitcoinEvents;

ctrl.type = 'UTXO' as const;
export function ctrl(parameters: UTXOConnectorParameters = {}) {
  const { chainId, shimDisconnect = true } = parameters;
  let accountsChanged: ((accounts: Address[]) => void) | undefined;
  return createConnector<
    UTXOWalletProvider | undefined,
    CtrlConnectorProperties
  >((config) => ({
    id: 'io.xdefi.bitcoin',
    name: 'XDEFI',
    type: ctrl.type,
    icon: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTEyIiBoZWlnaHQ9IjUxMiIgdmlld0JveD0iMCAwIDUxMiA1MTIiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxnIGNsaXAtcGF0aD0idXJsKCNjbGlwMF8yMTkxXzQyOTApIj4KPHJlY3Qgd2lkdGg9IjUxMiIgaGVpZ2h0PSI1MTIiIHJ4PSIxMDQiIGZpbGw9IiMzMzVERTUiLz4KPHBhdGggZD0iTTQ2My40MzggMjQxLjI0N0M0NjAuNzY1IDIwNS4xMzUgNDQ4LjU4IDE3MC4zMzggNDI4LjA4NyAxNDAuMjcxQzQwNy41OTkgMTEwLjIwOSAzNzkuNTA5IDg1LjkxODIgMzQ2LjU3OSA2OS43OTZDMzEzLjY1MyA1My42NzggMjc3LjAzMiA0Ni4yODA0IDI0MC4zMiA0OC4zMzYzQzIwMy42MDUgNTAuMzkyMSAxNjguMDY5IDYxLjgyNTUgMTM3LjIxMiA4MS41MjAxQzEwNi4zNTQgMTAxLjIxIDgxLjIzOTQgMTI4LjQ4IDY0LjMzODYgMTYwLjYzNkw2My41MzYgMTYyLjI1N0M1OC4xOTcxIDE3My4xMjYgNTQuNTg3OCAxODQuNzQ1IDUyLjg0MTEgMTk2LjY5N0M0Ny44NDU1IDIzMi4wMjEgNTUuNTkyIDI2My40NiA3NS44Mjc1IDI4Ny42NjdDOTcuOTU5OSAzMTQuMTM2IDEzMy45OTMgMzI5Ljg3OSAxNzcuMjE1IDMzMS45NDdDMjI5LjgzMiAzMzQuNTU1IDI4Mi4xNDggMzIwLjQzNCAzMTkuMjc1IDI5NC40NThMMzQxLjI4NyAzMDcuMzUzQzMyMC4yNTggMzI1LjI5MSAyNzEuNjM3IDM1Ny41OTQgMTkxLjExMiAzNjIuMDA5QzEwMC43MTkgMzY2LjkzIDYzLjA0MjUgMzM4LjAwMSA2Mi42OTA1IDMzNy43MDZMNTYuMzUxNyAzNDUuNDAzTDQ4IDM1NS4yNzNDNDkuNjAwOCAzNTYuNiA4NS43Mjg1IDM4NS4zMzUgMTcwLjU3NiAzODUuMzM1QzE3Ny41MiAzODUuMzM1IDE4NC44MTYgMzg1LjMzNSAxOTIuNDEyIDM4NC43NDZDMjg5Ljg3MyAzNzkuMzkxIDM0My40NzYgMzM3LjU3NSAzNjIuMjMxIDMxOS42MjlMMzgwLjY0MiAzMzAuNjM3QzM2OC4yNjEgMzQ2LjY1OCAzNTMuMDI1IDM2MC4zMzMgMzM1LjY3IDM3MC45ODJDMjc0LjUwNCA0MDkuODQ5IDE5Ni43MDggNDE0Ljg2NyAxNDIuMjQyIDQxMi4xNjJMMTQxLjA5NiA0MzQuODMxQzE1MC4yNDIgNDM1LjI3MyAxNTkuMDM1IDQzNS40NzEgMTY3LjU4IDQzNS40NzFDMzIxLjA0OCA0MzUuNDcxIDM4My4xMzIgMzY2LjcxOSA0MDAuNTM5IDM0Mi4wNjJMNDE0LjkyNSAzNTAuNDg3QzQwMS4xMzUgMzczLjYwMyAzODIuMzkzIDM5My41NjcgMzU5LjkzMSA0MDguOTM5QzMzMy4wMzQgNDI3LjM0NSAzMDEuNzM1IDQzOC41MzggMjY5LjExNCA0NDEuNDE1TDI3MS4xMTQgNDY0QzMwNy43MzkgNDYwLjc4NiAzNDIuODg4IDQ0OC4yMzYgMzczLjA4OSA0MjcuNTgxQzQwMy4yOSA0MDYuOTI2IDQyNy41MDggMzc4Ljg4MSA0NDMuMzQ5IDM0Ni4yMDdDNDU5LjE4NSAzMTMuNTI5IDQ2Ni4xMTYgMjc3LjM1OCA0NjMuNDM4IDI0MS4yNDdaTTM3NC44MSAyNDQuNzM5QzM2NC42MjYgMjQ0LjczOSAzNTYuMzY4IDIzNi42MTMgMzU2LjM2OCAyMjYuNTg2QzM1Ni4zNjggMjE2LjU2IDM2NC42MjEgMjA4LjQzMyAzNzQuODEgMjA4LjQzM0MzODQuOTkgMjA4LjQzMyAzOTMuMjQ3IDIxNi41NiAzOTMuMjQ3IDIyNi41ODZDMzkzLjI0NyAyMzYuNjEzIDM4NC45OTQgMjQ0LjczOSAzNzQuODEgMjQ0LjczOVoiIGZpbGw9IiNFQ0VDRUMiLz4KPC9nPgo8ZGVmcz4KPGNsaXBQYXRoIGlkPSJjbGlwMF8yMTkxXzQyOTAiPgo8cmVjdCB3aWR0aD0iNTEyIiBoZWlnaHQ9IjUxMiIgZmlsbD0id2hpdGUiLz4KPC9jbGlwUGF0aD4KPC9kZWZzPgo8L3N2Zz4K',
    async setup() {
      //
    },
    async getInternalProvider() {
      if (typeof window === 'undefined') {
        return;
      }
      if ('xfi' in window) {
        const anyWindow: any = window;
        return anyWindow.xfi?.bitcoin;
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
    async request(this: CtrlBitcoinProvider, { method, params }): Promise<any> {
      switch (method) {
        case 'signPsbt':
          const { psbt, ...options } = params as SignPsbtParameters;
          const signedPsbt = await this.signPsbt(psbt, options.finalize);
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
      const accounts = await provider.getAccounts();
      return accounts as Address[];
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

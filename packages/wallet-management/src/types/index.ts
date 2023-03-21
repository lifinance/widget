import type EventEmitter from 'node:events';

export interface ProviderConnectInfo {
  readonly chainId: string;
}
export interface ProviderRpcError extends Error {
  message: string;
  code: number;
  data?: unknown;
}

export interface RequestArguments {
  readonly method: string;
  readonly params?: readonly unknown[] | object;
}

export interface Provider extends EventEmitter {
  request(args: RequestArguments): Promise<unknown>;
  selectedAddress?: any[];
  chainId?: any;
}

import type { Signer } from '@ethersproject/abstract-signer';
import type { Token } from '@lifi/sdk';
import type { ethers } from 'ethers';
import type events from 'events';

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
  selectedAddress?: string;
  chainId?: any;
}

export interface AccountData {
  chainId: number;
  address: string;
  signer: Signer;
  provider: ethers.providers.Web3Provider;
}
export interface InjectedConnectorConstructorArgs {
  name: string;
  icon: string;
  installed: (helpers: { provider: any }) => boolean;
}
export interface WalletConnectConnectorConstructorArgs {
  name: string;
  icon: string;
  installed: (helpers: { provider: any }) => boolean;
  rpc: {
    [chainId: number]: string;
  };
}

export interface Wallet extends events.EventEmitter {
  name: string;
  icon: string;
  isActivationInProgress: boolean;
  account: AccountData | undefined;
  installed: (helpers: { provider: any }) => boolean;
  connect: () => Promise<void>;
  autoConnect?: () => Promise<void>;
  disconnect: () => void;
  switchChain: (chainId: number) => Promise<boolean>;
  addChain: (chainId: number) => Promise<boolean>;
  addToken: (chainId: number, token: Token) => Promise<boolean>;
}

export enum ProviderIdentityFlag {
  AlphaWallet = 'isAlphaWallet',
  AToken = 'isAToken',
  BlockWallet = 'isBlockWallet',
  Binance = 'bbcSignTx',
  Bitpie = 'isBitpie',
  Coinbase = 'isToshi',
  CoinbaseExtension = 'isCoinbaseWallet',
  Detected = 'request',
  Dcent = 'isDcentWallet',
  Frame = 'isFrame',
  HuobiWallet = 'isHbWallet',
  HyperPay = 'isHyperPay',
  ImToken = 'isImToken',
  Liquality = 'isLiquality',
  MeetOne = 'wallet',
  MetaMask = 'isMetaMask',
  MyKey = 'isMYKEY',
  OwnBit = 'isOwnbit',
  Status = 'isStatus',
  TallyHo = 'isTally',
  Trust = 'isTrust',
  TokenPocket = 'isTokenPocket',
  TP = 'isTp',
  WalletIo = 'isWalletIO',
  XDEFI = '__XDEFI',
  OneInch = 'isOneInchIOSWallet',
  Tokenary = 'isTokenary',
  MathWallet = 'isMathWallet',
  Frontier = 'isFrontier',
}

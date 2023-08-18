import type { Signer } from '@ethersproject/abstract-signer';
import type { Web3Provider } from '@ethersproject/providers';
import type { StaticToken } from '@lifi/sdk';
import type { EthereumProviderOptions } from '@walletconnect/ethereum-provider/dist/types/EthereumProvider';
import type { EventEmitter } from 'events';

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
  provider: Web3Provider;
  isMultisigWallet?: boolean;
}

export interface InjectedConnectorArgs {
  name: string;
  icon: string;
  installed: () => Promise<boolean>;
}

export interface WalletConnectConnectorArgs {
  name: string;
  icon: string;
  installed: () => Promise<boolean>;
  options: EthereumProviderOptions;
}

export interface Wallet extends EventEmitter {
  name: string;
  icon: string;
  isActivationInProgress: boolean;
  account?: AccountData;
  installed: () => Promise<boolean>;
  connect: () => Promise<void>;
  autoConnect?: () => Promise<void>;
  disconnect: () => void;
  switchChain: (chainId: number) => Promise<boolean>;
  addChain: (chainId: number) => Promise<boolean>;
  addToken: (chainId: number, token: StaticToken) => Promise<boolean>;
}

export enum ProviderIdentityFlag {
  AlphaWallet = 'isAlphaWallet',
  BlockWallet = 'isBlockWallet',
  Binance = 'bbcSignTx',
  Bitpie = 'isBitpie',
  Coinbase = 'isToshi',
  CoinbaseExtension = 'isCoinbaseWallet',
  Detected = 'request',
  Dcent = 'isDcentWallet',
  Frame = 'isFrame',
  HyperPay = 'isHyperPay',
  ImToken = 'isImToken',
  Liquality = 'isLiquality',
  MetaMask = 'isMetaMask',
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
  ApexWallet = 'isApexWallet',
}

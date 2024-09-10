import type { Adapter, WalletName } from '@solana/wallet-adapter-base';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import {
  ConnectionProvider,
  useWallet,
  WalletProvider,
} from '@solana/wallet-adapter-react';
import { clusterApiUrl } from '@solana/web3.js';
import mitt, { Emitter } from 'mitt';
import { useEffect, type FC, type PropsWithChildren } from 'react';

const endpoint = clusterApiUrl(WalletAdapterNetwork.Mainnet);
/**
 * Can be empty because wallets from Dynamic will be used
 */
const wallets: Adapter[] = [];

export const SolanaConnectedWalletKey = 'li.fi-widget-recent-wallet';

type WalletEvents = {
  connect: string;
  disconnect: void;
};

export const emitter: Emitter<WalletEvents> = mitt<WalletEvents>();

export const SolanaProvider: FC<PropsWithChildren> = ({ children }) => {
  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider
        wallets={wallets}
        localStorageKey={SolanaConnectedWalletKey}
        autoConnect
      >
        <SolanaDynamicHandler />
        {children}
      </WalletProvider>
    </ConnectionProvider>
  );
};

export const SolanaDynamicHandler: FC = () => {
  const { disconnect, select } = useWallet();
  useEffect(() => {
    emitter.on('connect', async (connectorName) => {
      select(connectorName as WalletName);
    });
    emitter.on('disconnect', async () => {
      await disconnect();
    });
    return () => emitter.all.clear();
  }, [disconnect, select]);
  return null;
};

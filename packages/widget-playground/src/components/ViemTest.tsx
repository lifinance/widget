import { Box } from '@mui/material';
import { getWalletClient } from '@wagmi/core';
import { useEffect } from 'react';
import type { Address, WalletClient } from 'viem';
import { createWalletClient, http, publicActions } from 'viem';
import { mnemonicToAccount } from 'viem/accounts';
import {
  WagmiConfig,
  configureChains,
  createConfig,
  useAccount,
  useConnect,
  useDisconnect,
  useWalletClient,
} from 'wagmi';
import * as wagmiChains from 'wagmi/chains';
import { InjectedConnector } from 'wagmi/connectors/injected';
import { publicProvider } from 'wagmi/providers/public';

const { chains, publicClient, webSocketPublicClient } = configureChains(
  Object.values(wagmiChains),
  [publicProvider()],
);

const config = createConfig({
  autoConnect: true,
  publicClient,
  webSocketPublicClient,
  connectors: [new InjectedConnector()],
});

export const ViemTest = () => {
  return (
    <WagmiConfig config={config}>
      <ViemTest1 />
    </WagmiConfig>
  );
};

export const ViemTest1 = () => {
  const { connector: activeConnector, isConnected, address } = useAccount();
  const { connect, connectors, error, isLoading, pendingConnector } =
    useConnect();
  const { disconnect } = useDisconnect();
  const { data: wc, isError } = useWalletClient();

  useEffect(() => {
    if (!wc) {
      return;
    }
    (async () => {
      const walletClient = await getWalletClient({
        chainId: await wc.getChainId(),
      });
      console.log(
        await walletClient?.getChainId(),
        walletClient?.chain?.id,
        walletClient?.account.type,
        walletClient?.account.address,
      );
    })();
  }, [wc]);

  const handleSwitchChain = async () => {
    if (!wc) {
      return;
    }
    const account = mnemonicToAccount(
      'mirror either social pioneer detail essay tribe upset increase hire office draw' as Address,
    );
    const walletClient: WalletClient = createWalletClient({
      account,
      chain: wagmiChains.mainnet,
      transport: http(
        'https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161',
      ),
    });
    // const walletClient = await getWalletClient({
    //   chainId: await wc.getChainId(),
    // });
    const client = walletClient?.extend(publicActions);
    const balance1 = await client?.getBalance({
      address: client?.account?.address!,
    });
    await client?.switchChain({ id: 137 });
    const balance2 = await client?.getBalance({
      address: client?.account?.address!,
    });
    console.log(
      'switched',
      await client?.getChainId(),
      client?.chain?.id,
      client?.account?.type,
      client?.account?.address,
      balance1,
      balance2,
    );
  };

  return (
    <WagmiConfig config={config}>
      <Box m={2}>
        {isConnected && (
          <div>
            Connected to {activeConnector?.name} {address}
          </div>
        )}

        {connectors.map((connector) => (
          <button
            disabled={!connector.ready}
            key={connector.id}
            onClick={() => connect({ connector })}
          >
            {connector.name}
            {isLoading &&
              pendingConnector?.id === connector.id &&
              ' (connecting)'}
          </button>
        ))}

        {error && <div>{error.message}</div>}

        <button onClick={() => disconnect()}>Disconnect</button>
        <button onClick={handleSwitchChain}>Switch chain</button>
      </Box>
    </WagmiConfig>
  );
};

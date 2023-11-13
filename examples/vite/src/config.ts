import { configureChains, createConfig } from 'wagmi';
import { mainnet } from 'wagmi/chains';
import { InjectedConnector } from 'wagmi/connectors/injected';
import { publicProvider } from 'wagmi/providers/public';

export const { chains, publicClient, webSocketPublicClient } = configureChains(
  [mainnet],
  [publicProvider()],
);

export const config = createConfig({
  // autoConnect: true,
  connectors: [new InjectedConnector({ options: { shimDisconnect: true } })],
  publicClient,
  webSocketPublicClient,
});

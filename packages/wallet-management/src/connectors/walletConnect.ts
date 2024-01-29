import type { WalletConnectParameters } from '@wagmi/connectors';
import { walletConnect as _walletConnect } from '@wagmi/connectors';

export const createWalletConnectConnector = /*@__PURE__*/ (
  params: WalletConnectParameters,
) =>
  _walletConnect({
    showQrModal: true,
    qrModalOptions: {
      themeVariables: {
        '--wcm-z-index': '3000',
      },
    },
    ...params,
  });

import type { Chain } from '@lifi/sdk';
import { lifiExplorerUrl } from '../config/constants.js';
import { useAvailableChains } from '../hooks/useAvailableChains.js';
import { useWidgetConfig } from '../providers/WidgetProvider/WidgetProvider.js';

const sanitiseBaseUrl = (baseUrl: string) => baseUrl.trim().replace(/\/+$/, '');

export const useExplorer = () => {
  const { explorerUrls } = useWidgetConfig();
  const { getChainById } = useAvailableChains();

  const getBaseUrl = (chain: Chain) => {
    const baseUrl = explorerUrls?.[chain.id]
      ? explorerUrls[chain.id][0]
      : chain.metamask.blockExplorerUrls[0];

    return sanitiseBaseUrl(baseUrl);
  };

  const getTransactionLink = (txHash: string, chain?: Chain) => {
    if (!chain) {
      const baseUrl = explorerUrls?.internal?.[0]
        ? sanitiseBaseUrl(explorerUrls?.internal[0])
        : lifiExplorerUrl;
      return `${baseUrl}/tx/${txHash}`;
    }

    return `${getBaseUrl(chain)}/tx/${txHash}`;
  };

  const getTransactionLinkByChainId = (txHash: string, chainId: number) => {
    return getTransactionLink(txHash, getChainById(chainId));
  };

  const getAddressLink = (address: string, chain?: Chain) => {
    // TODO: consider here that LiFi explorer supports /wallet/ rather than /address/
    if (!chain && explorerUrls?.internal?.[0]) {
      const baseUrl = sanitiseBaseUrl(explorerUrls?.internal[0]);
      return `${baseUrl}/address/${address}`;
    }

    return chain ? `${getBaseUrl(chain)}/address/${address}` : undefined;
  };

  const getAddressLinkByChainId = (address: string, chainId: number) => {
    return getAddressLink(address, getChainById(chainId));
  };

  return {
    getTransactionLink,
    getTransactionLinkByChainId,
    getAddressLink,
    getAddressLinkByChainId,
  };
};

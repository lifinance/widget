import type { ExtendedChain } from '@lifi/sdk';
import type { Address, Chain } from 'viem';

type ChainBlockExplorer = {
  name: string;
  url: string;
};

type ChainBlockExplorers = {
  [key: string]: ChainBlockExplorer;
  default: ChainBlockExplorer;
};

export const convertExtendedChain = (chain: ExtendedChain): Chain => ({
  ...chain,
  ...chain.metamask,
  blockExplorers: chain.metamask.blockExplorerUrls.reduce(
    (blockExplorers, blockExplorer, index) => {
      blockExplorers[index === 0 ? 'default' : `${index}`] = {
        name: blockExplorer,
        url: blockExplorer,
      };
      return blockExplorers;
    },
    {} as ChainBlockExplorers,
  ),
  name: chain.metamask.chainName,
  rpcUrls: {
    default: { http: chain.metamask.rpcUrls },
    public: { http: chain.metamask.rpcUrls },
  },
  contracts: {
    ...(chain.multicallAddress
      ? { multicall3: { address: chain.multicallAddress as Address } }
      : undefined),
  },
});

export function isExtendedChain(chain: any): chain is ExtendedChain {
  return (
    typeof chain === 'object' &&
    chain !== null &&
    'key' in chain &&
    'chainType' in chain &&
    'coin' in chain &&
    'mainnet' in chain &&
    'logoURI' in chain &&
    typeof chain.metamask === 'object' &&
    chain.metamask !== null &&
    typeof chain.nativeToken === 'object' &&
    chain.nativeToken !== null
  );
}

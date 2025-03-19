import { ChainType, type ExtendedChain } from '@lifi/widget'
import type { AppKitNetwork, ChainNamespace } from '@reown/appkit-common'
import { defineChain } from '@reown/appkit/networks'

export type AppKitSupportedChainTypes = Exclude<ChainType, ChainType.MVM>

export const ChainTypeSpaceMap: Record<
  AppKitSupportedChainTypes,
  ChainNamespace
> = {
  [ChainType.EVM]: 'eip155',
  [ChainType.UTXO]: 'bip122',
  [ChainType.SVM]: 'solana',
}

export type ChainImages = Record<number, string>

export const chainToAppKitNetworks = (
  chains: ExtendedChain[]
): AppKitNetwork[] =>
  chains.map((chain) =>
    defineChain({
      id: chain.id,
      blockExplorers: {
        default: {
          name: `${chain.name} explorer`,
          url: chain.metamask.blockExplorerUrls[0],
        },
      },
      name: chain.metamask.chainName,
      rpcUrls: {
        default: {
          http: chain.metamask.rpcUrls,
        },
      },
      nativeCurrency: chain.metamask.nativeCurrency,
      chainNamespace:
        ChainTypeSpaceMap[chain.chainType as AppKitSupportedChainTypes],
      caipNetworkId: `${ChainTypeSpaceMap[chain.chainType as AppKitSupportedChainTypes]}:${chain.id}`,
      assets: {
        imageId: `${ChainTypeSpaceMap[chain.chainType as AppKitSupportedChainTypes]}:${chain.id}`,
        imageUrl: chain.logoURI!,
      },
    })
  )

export const getChainImagesConfig = (chains: ExtendedChain[]): ChainImages => {
  const chainImages: ChainImages = {}
  for (const chain of chains) {
    chainImages[chain.id] = chain.logoURI || ''
  }
  return chainImages
}

export interface NFTOpenSeaProps {
  network: NFTNetwork;
  contractAddress: string;
  tokenId: number | string;
}

export enum ChainId {
  arbitrum = 42161,
  avalanche = 43114,
  ethereum = 1,
  goerli = 5,
  klaytn = 8217,
  matic = 137,
  optimism = 10,
}

export type NFTNetwork =
  | 'arbitrum'
  | 'avalanche'
  | 'ethereum'
  | 'goerli'
  | 'klaytn'
  | 'matic'
  | 'optimism';

export const openSeaContractTool = {
  logoURI: 'https://testnets.opensea.io/static/images/logos/opensea.svg',
  name: 'OpenSea',
};

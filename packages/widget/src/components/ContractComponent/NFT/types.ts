import type { ContractCall, TokenAmount } from '@lifi/sdk';

export interface NFTBaseProps {
  imageUrl?: string;
  collectionName?: string;
  assetName?: string;
  isLoading?: boolean;
  owner?: NFTOwner;
  token: TokenAmount;
}

export interface NFTProps extends NFTBaseProps {
  contractCall?: ContractCall;
}

export interface NFTOwner {
  name?: string;
  url?: string;
}

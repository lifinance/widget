import type { TokenAmount } from '@lifi/sdk';
import type { WidgetContract } from '../../types';

export interface NFTProps {
  imageUrl?: string;
  collectionName?: string;
  assetName?: string;
  isLoading?: boolean;
  owner?: NFTOwner;
  token?: TokenAmount;
  contract?: WidgetContract;
}

export interface NFTOwner {
  name?: string;
  url?: string;
}

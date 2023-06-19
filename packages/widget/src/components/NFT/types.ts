import type { TokenAmount } from '@lifi/sdk';
import type { WidgetContract } from '../../types';

export interface NFTBaseProps {
  imageUrl?: string;
  collectionName?: string;
  assetName?: string;
  isLoading?: boolean;
  owner?: NFTOwner;
  token?: TokenAmount;
}

export interface NFTProps extends NFTBaseProps {
  contract?: WidgetContract;
}

export interface NFTOwner {
  name?: string;
  url?: string;
}

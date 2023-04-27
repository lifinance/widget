import type { TokenAmount as SDKTokenAmount } from '@lifi/sdk';

export interface TokenAmount extends SDKTokenAmount {
  featured?: boolean;
}

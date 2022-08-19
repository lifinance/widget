import type { TokenAmount } from '@lifi/sdk';

export interface Token extends TokenAmount {
  featured?: boolean;
}

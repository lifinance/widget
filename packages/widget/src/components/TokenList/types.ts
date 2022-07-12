import { TokenAmount } from '@lifi/sdk';
import { SwapFormDirection } from '../../providers/SwapFormProvider';

export interface TokenListProps {
  formType: SwapFormDirection;
  height: number;
  onClick?(): void;
}

export interface TokenListItemBaseProps {
  onClick?(token: string): void;
  size: number;
  start: number;
}

export interface TokenListItemProps extends TokenListItemBaseProps {
  showBalance?: boolean;
  token: TokenAmount;
}

import { TokenAmount } from '@lifinance/sdk';
import { SwapFormDirection } from '../../providers/SwapFormProvider';

export interface TokenListProps {
  formType: SwapFormDirection;
  headerHeight: number;
  height: number;
  onClick?(): void;
}

export interface TokenListItemBaseProps {
  onClick?(token: string): void;
  size: number;
  start: number;
}

export interface TokenListItemProps extends TokenListItemBaseProps {
  token: TokenAmount;
}

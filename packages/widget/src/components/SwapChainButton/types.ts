import { SwapFormDirection } from '../../providers/SwapFormProvider';

export interface SwapChainButtonProps {
  onClick?(type: SwapFormDirection): void;
  type: SwapFormDirection;
}

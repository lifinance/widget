import {
  SwapFormDirection,
  SwapFormTypeProps,
} from '../../providers/SwapFormProvider';

export interface SwapChainButtonProps extends SwapFormTypeProps {
  onClick?(formType: SwapFormDirection): void;
}

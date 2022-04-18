import {
  SwapFormDirection,
  SwapFormTypeProps,
} from '../../providers/SwapFormProvider';

export interface SelectTokenButtonProps extends SwapFormTypeProps {
  onClick?(formType: SwapFormDirection): void;
}

import type { MutableRefObject } from 'react';
import { forwardRef, useLayoutEffect } from 'react';
import { useWatch } from 'react-hook-form';
import type { SwapFormTypeProps } from '../../providers';
import { SwapFormKeyHelper } from '../../providers';
import { fitInputText } from '../../utils';
import { maxInputFontSize, minInputFontSize } from './SwapInput.style';

export const FitInputText = forwardRef<HTMLInputElement, SwapFormTypeProps>(
  ({ formType }, ref) => {
    const amountKey = SwapFormKeyHelper.getAmountKey(formType);
    const [amount] = useWatch({
      name: [amountKey],
    });

    useLayoutEffect(() => {
      fitInputText(
        maxInputFontSize,
        minInputFontSize,
        (ref as MutableRefObject<HTMLInputElement | null>)
          .current as HTMLElement,
      );
    }, [amount, ref]);

    return null;
  },
);

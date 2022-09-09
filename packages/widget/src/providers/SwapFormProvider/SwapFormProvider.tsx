import { FormProvider, useForm } from 'react-hook-form';
import { useWidgetConfig } from '../WidgetProvider';
import type { SwapFormValues } from './types';
import { SwapFormKey } from './types';

export const formDefaultValues = {
  [SwapFormKey.FromAmount]: '',
  [SwapFormKey.ToAddress]: '',
  [SwapFormKey.TokenSearchFilter]: '',
};

export const SwapFormProvider: React.FC<React.PropsWithChildren<{}>> = ({
  children,
}) => {
  const { fromChain, fromToken, fromAmount, toChain, toToken, toAddress } =
    useWidgetConfig();

  const methods = useForm<SwapFormValues>({
    defaultValues: {
      ...formDefaultValues,
      fromChain,
      fromToken,
      fromAmount:
        (typeof fromAmount === 'number'
          ? fromAmount?.toPrecision()
          : fromAmount) || formDefaultValues.fromAmount,
      toChain,
      toToken,
      toAddress,
    },
  });

  return <FormProvider {...methods}>{children}</FormProvider>;
};

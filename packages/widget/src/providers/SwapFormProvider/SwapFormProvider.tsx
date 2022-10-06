import { FormProvider, useForm } from 'react-hook-form';
import { useWidgetConfig } from '../WidgetProvider';
import type { SwapFormValues } from './types';
import { SwapFormKey } from './types';
import { URLSearchParamsBuilder } from './URLSearchParamsBuilder';

export const formDefaultValues = {
  [SwapFormKey.FromAmount]: '',
  [SwapFormKey.ToAddress]: '',
  [SwapFormKey.TokenSearchFilter]: '',
};

export const SwapFormProvider: React.FC<React.PropsWithChildren<{}>> = ({
  children,
}) => {
  const {
    fromChain,
    fromToken,
    fromAmount,
    toChain,
    toToken,
    toAddress,
    buildSwapUrl,
  } = useWidgetConfig();

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

  return (
    <FormProvider {...methods}>
      {buildSwapUrl ? <URLSearchParamsBuilder /> : null}
      {children}
    </FormProvider>
  );
};

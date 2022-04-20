import { FormProvider, useForm } from 'react-hook-form';
import { useWidgetConfig } from '../WidgetProvider';
import { SwapFormKey, SwapFormValues } from './types';

const defaultValues = {
  [SwapFormKey.FromAmount]: '',
  [SwapFormKey.GasPrice]: 'normal',
  [SwapFormKey.Slippage]: '3',
  [SwapFormKey.SearchTokensFilter]: '',
};

export const SwapFormProvider: React.FC<React.PropsWithChildren<{}>> = ({
  children,
}) => {
  const { fromChain, fromToken, fromAmount, toChain, toToken } =
    useWidgetConfig();

  const methods = useForm<SwapFormValues>({
    defaultValues: {
      ...defaultValues,
      fromChain,
      fromToken,
      fromAmount: fromAmount?.toPrecision() ?? defaultValues.fromAmount,
      toChain,
      toToken,
    },
  });

  return <FormProvider {...methods}>{children}</FormProvider>;
};

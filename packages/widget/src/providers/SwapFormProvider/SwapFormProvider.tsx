import { FormProvider, useForm } from 'react-hook-form';
import { useWidgetConfig } from '../WidgetProvider';
import { SwapFormKey, SwapFormValues } from './types';

const defaultValues = {
  [SwapFormKey.FromSearchTokensFilter]: '',
  [SwapFormKey.ToSearchTokensFilter]: '',
  [SwapFormKey.FromAmount]: 0,
  [SwapFormKey.ToAmount]: 0,
  [SwapFormKey.Slippage]: '0.5',
};

export const SwapFormProvider: React.FC = ({ children }) => {
  const { fromChain, fromToken, fromAmount, toChain, toToken } =
    useWidgetConfig();

  const methods = useForm<SwapFormValues>({
    defaultValues: {
      ...defaultValues,
      fromChain,
      fromToken,
      fromAmount,
      toChain,
      toToken,
    },
  });

  return <FormProvider {...methods}>{children}</FormProvider>;
};

import { Order } from '@lifinance/sdk';
import { FormProvider, useForm } from 'react-hook-form';
import { useWidgetConfig } from '../WidgetProvider';
import { SwapFormKey, SwapFormValues } from './types';

export const formDefaultValues = {
  [SwapFormKey.FromAmount]: '',
  [SwapFormKey.GasPrice]: 'normal',
  [SwapFormKey.Slippage]: '3',
  [SwapFormKey.SearchTokensFilter]: '',
  [SwapFormKey.RoutePriority]: 'RECOMMENDED' as Order,
};

export const SwapFormProvider: React.FC<React.PropsWithChildren<{}>> = ({
  children,
}) => {
  const { fromChain, fromToken, fromAmount, toChain, toToken } =
    useWidgetConfig();

  const methods = useForm<SwapFormValues>({
    defaultValues: {
      ...formDefaultValues,
      fromChain,
      fromToken,
      fromAmount: fromAmount?.toPrecision() ?? formDefaultValues.fromAmount,
      toChain,
      toToken,
    },
  });

  return <FormProvider {...methods}>{children}</FormProvider>;
};

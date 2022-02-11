import { ChainKey } from '@lifinance/sdk';
import { FormProvider, useForm } from 'react-hook-form';
import { useWidgetConfig } from './WidgetProvider';

export type SwapFormValues = {
  fromChain: ChainKey;
  fromToken: string;
  fromAmount: number;
  toChain: ChainKey;
  toToken: string;
};

const defaultValues = {
  fromAmount: null,
  toAmount: null,
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

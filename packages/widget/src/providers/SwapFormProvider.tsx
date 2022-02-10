import { FormProvider, useForm } from 'react-hook-form';
import { useWidget } from './WidgetProvider';

const defaultValues = {
  fromAmount: null,
  toAmount: null,
};

export const SwapFormProvider: React.FC = ({ children }) => {
  const { fromChain, fromToken, fromAmount, toChain, toToken } = useWidget();
  const methods = useForm({
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

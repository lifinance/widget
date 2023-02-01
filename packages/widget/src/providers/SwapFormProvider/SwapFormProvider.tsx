import { useMemo } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useWidgetConfig } from '../WidgetProvider';
import { FormUpdater } from './FormUpdater';
import type { SwapFormValues } from './types';
import { SwapFormKey } from './types';
import { URLSearchParamsBuilder } from './URLSearchParamsBuilder';

export const formDefaultValues = {
  [SwapFormKey.FromAmount]: '',
  [SwapFormKey.ToAddress]: '',
  [SwapFormKey.TokenSearchFilter]: '',
  [SwapFormKey.ContractOutputsToken]: '',
  [SwapFormKey.ToContractAddress]: '',
  [SwapFormKey.ToContractCallData]: '',
  [SwapFormKey.ToContractGasLimit]: '',
  [SwapFormKey.ToAmount]: '',
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

  const defaultValues = useMemo(
    () => ({
      ...formDefaultValues,
      fromChain,
      fromToken,
      fromAmount:
        (typeof fromAmount === 'number'
          ? fromAmount?.toPrecision()
          : fromAmount) || formDefaultValues.fromAmount,
      toChain,
      toToken,
      toAddress: toAddress || formDefaultValues.toAddress,
    }),
    [fromAmount, fromChain, fromToken, toAddress, toChain, toToken],
  );

  const methods = useForm<SwapFormValues>({
    // values,
    defaultValues,
  });

  return (
    <FormProvider {...methods}>
      <FormUpdater defaultValues={defaultValues} />
      {buildSwapUrl ? <URLSearchParamsBuilder /> : null}
      {children}
    </FormProvider>
  );
};

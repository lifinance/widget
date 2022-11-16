import { useEffect, useMemo, useRef } from 'react';
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
      toAddress,
    }),
    [fromAmount, fromChain, fromToken, toAddress, toChain, toToken],
  );

  const previousDefaultValues = useRef(defaultValues);

  const methods = useForm<SwapFormValues>({
    defaultValues,
  });

  useEffect(() => {
    (Object.keys(defaultValues) as SwapFormKey[]).forEach((key) => {
      if (previousDefaultValues.current[key] !== defaultValues[key]) {
        methods.resetField(key, {
          defaultValue: defaultValues[key] || '',
          keepDirty: true,
          keepTouched: true,
        });
      }
    });
    previousDefaultValues.current = defaultValues;
  }, [defaultValues, methods]);

  return (
    <FormProvider {...methods}>
      {buildSwapUrl ? <URLSearchParamsBuilder /> : null}
      {children}
    </FormProvider>
  );
};

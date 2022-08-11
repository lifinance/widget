import { ChainId } from '@lifi/sdk';
import { useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useWallet } from '../WalletProvider';
import { useWidgetConfig } from '../WidgetProvider';
import { SwapFormKey, SwapFormValues } from './types';

export const formDefaultValues = {
  [SwapFormKey.FromAmount]: '',
  [SwapFormKey.TokenSearchFilter]: '',
};

export const SwapFormProvider: React.FC<React.PropsWithChildren<{}>> = ({
  children,
}) => {
  const { account } = useWallet();

  const { fromChain, fromToken, fromAmount, toChain, toToken } =
    useWidgetConfig();

  const methods = useForm<SwapFormValues>({
    defaultValues: {
      ...formDefaultValues,
      fromChain: fromChain ?? ChainId.ETH,
      fromToken,
      fromAmount:
        (typeof fromAmount === 'number'
          ? fromAmount?.toPrecision()
          : fromAmount) || formDefaultValues.fromAmount,
      toChain: toChain ?? ChainId.ETH,
      toToken,
    },
  });

  // Set wallet chain as default if no fromChain is provided by config and if it wasn't changed during widget usage
  useEffect(() => {
    const { isDirty, isTouched } = methods.getFieldState(
      SwapFormKey.FromChain,
      methods.formState,
    );
    if (
      account.isActive &&
      account.chainId &&
      !fromChain &&
      !isDirty &&
      !isTouched
    ) {
      methods.setValue(SwapFormKey.FromChain, account.chainId, {
        shouldDirty: false,
        shouldTouch: false,
      });
    }
  }, [account.chainId, account.isActive, fromChain, methods]);

  return <FormProvider {...methods}>{children}</FormProvider>;
};

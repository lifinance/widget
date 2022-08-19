import { ChainId } from '@lifi/sdk';
import { useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useWallet } from '../WalletProvider';
import { useWidgetConfig } from '../WidgetProvider';
import type { SwapFormValues } from './types';
import { SwapFormKey } from './types';

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

  // Set wallet chain as default if no chains are provided by config and if they were not changed during widget usage
  useEffect(() => {
    if (!account.isActive || !account.chainId) {
      return;
    }
    const { isDirty: isFromChainDirty, isTouched: isFromChainTouched } =
      methods.getFieldState(SwapFormKey.FromChain, methods.formState);
    if (!fromChain && !isFromChainDirty && !isFromChainTouched) {
      methods.setValue(SwapFormKey.FromChain, account.chainId, {
        shouldDirty: false,
        shouldTouch: false,
      });
    }
    const { isDirty: isToChainDirty, isTouched: isToChainTouched } =
      methods.getFieldState(SwapFormKey.ToChain, methods.formState);
    if (!toChain && !isToChainDirty && !isToChainTouched) {
      methods.setValue(SwapFormKey.ToChain, account.chainId, {
        shouldDirty: false,
        shouldTouch: false,
      });
    }
  }, [account.chainId, account.isActive, fromChain, methods, toChain]);

  return <FormProvider {...methods}>{children}</FormProvider>;
};

import { ChainId } from '@lifi/sdk';
import { useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useWallet } from '../WalletProvider';
import { useWidgetConfig } from '../WidgetProvider';
import type { SwapFormValues } from './types';
import { SwapFormKey } from './types';

export const formDefaultValues = {
  [SwapFormKey.FromAmount]: '',
  [SwapFormKey.ToAddress]: '',
  [SwapFormKey.TokenSearchFilter]: '',
};

export const SwapFormProvider: React.FC<React.PropsWithChildren<{}>> = ({
  children,
}) => {
  const { account } = useWallet();

  const { fromChain, fromToken, fromAmount, toChain, toToken, toAddress } =
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
      toAddress,
    },
  });

  // Set wallet chain and address as default if no chains or address are provided by config and if they were not changed during widget usage
  useEffect(() => {
    const { isDirty: isToAddressDirty, isTouched: isToAddressTouched } =
      methods.getFieldState(SwapFormKey.ToAddress, methods.formState);
    if (!account.isActive || !account.chainId || !account.address) {
      if (!toAddress && !isToAddressDirty && !isToAddressTouched) {
        methods.setValue(SwapFormKey.ToAddress, '', {
          shouldDirty: false,
          shouldTouch: false,
        });
      }
      return;
    }
    const toAddressValue = methods.getValues(SwapFormKey.ToAddress);
    if (
      ((!isToAddressDirty && !isToAddressTouched) || !toAddressValue) &&
      !toAddress
    ) {
      methods.setValue(SwapFormKey.ToAddress, account.address, {
        shouldDirty: false,
        shouldTouch: false,
      });
    }
    const { isDirty: isFromChainDirty, isTouched: isFromChainTouched } =
      methods.getFieldState(SwapFormKey.FromChain, methods.formState);
    const { isDirty: isToChainDirty, isTouched: isToChainTouched } =
      methods.getFieldState(SwapFormKey.ToChain, methods.formState);
    if (!fromChain && !isFromChainDirty && !isFromChainTouched) {
      methods.setValue(SwapFormKey.FromChain, account.chainId, {
        shouldDirty: false,
        shouldTouch: false,
      });
    }
    if (
      !toChain &&
      !isToChainDirty &&
      !isToChainTouched &&
      !isFromChainDirty &&
      !isFromChainTouched
    ) {
      methods.setValue(SwapFormKey.ToChain, account.chainId, {
        shouldDirty: false,
        shouldTouch: false,
      });
    }
  }, [
    account.address,
    account.chainId,
    account.isActive,
    fromChain,
    methods,
    toAddress,
    toChain,
  ]);

  return <FormProvider {...methods}>{children}</FormProvider>;
};

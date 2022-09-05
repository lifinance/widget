import { ChainId } from '@lifi/sdk';
import { useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useChainOrderStore, useSetChainOrder } from '../../stores/chains';
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
  const [setChain] = useSetChainOrder();
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

  // Set wallet chain as default if no chains are provided by config and if they were not changed during widget usage
  useEffect(() => {
    if (!account.isActive || !account.chainId) {
      return;
    }

    const [fromChainValue, toChainValue] = methods.getValues([
      SwapFormKey.FromChain,
      SwapFormKey.ToChain,
    ]);

    const { isDirty: isFromChainDirty } = methods.getFieldState(
      SwapFormKey.FromChain,
      methods.formState,
    );
    const { isDirty: isToChainDirty } = methods.getFieldState(
      SwapFormKey.ToChain,
      methods.formState,
    );
    const { isDirty: isFromTokenDirty } = methods.getFieldState(
      SwapFormKey.FromToken,
      methods.formState,
    );
    const { isDirty: isToTokenDirty } = methods.getFieldState(
      SwapFormKey.ToToken,
      methods.formState,
    );

    // Users can switch chains in the wallet.
    // If we don't have a chain in the ordered chain list we should add it.
    setChain(account.chainId);

    // If we ran out of slots for the ordered chain list and the current chain isn't there
    // we should make a recently switched chain as current.
    const { chainOrder } = useChainOrderStore.getState();
    const hasFromChainInOrderedList = chainOrder.includes(fromChainValue);
    const hasToChainInOrderedList = chainOrder.includes(toChainValue);

    if (
      (!fromChain && !isFromChainDirty && !isFromTokenDirty) ||
      !hasFromChainInOrderedList
    ) {
      methods.setValue(SwapFormKey.FromChain, account.chainId, {
        shouldDirty: false,
      });
      methods.setValue(SwapFormKey.FromToken, '', {
        shouldDirty: false,
      });
      methods.setValue(SwapFormKey.FromAmount, '', {
        shouldDirty: false,
      });
    }
    if (
      (!toChain && !isToChainDirty && !isToTokenDirty) ||
      !hasToChainInOrderedList
    ) {
      methods.setValue(SwapFormKey.ToChain, account.chainId, {
        shouldDirty: false,
      });
      methods.setValue(SwapFormKey.ToToken, '', {
        shouldDirty: false,
      });
    }
  }, [
    account.chainId,
    account.isActive,
    fromChain,
    methods,
    setChain,
    toChain,
  ]);

  return <FormProvider {...methods}>{children}</FormProvider>;
};

import { useCallback } from 'react';
import { useFormContext } from 'react-hook-form';
import type { SwapFormType } from '../../providers';
import { SwapFormKeyHelper } from '../../providers';

export const useTokenSelect = (
  formType: SwapFormType,
  onClick?: () => void,
) => {
  const { setValue, getValues } = useFormContext();

  return useCallback(
    (tokenAddress: string, chainId?: number) => {
      const selectedChainId =
        chainId ?? getValues(SwapFormKeyHelper.getChainKey(formType));
      setValue(SwapFormKeyHelper.getTokenKey(formType), tokenAddress, {
        shouldTouch: true,
      });
      // Set chain again to trigger URL builder update
      setValue(SwapFormKeyHelper.getChainKey(formType), selectedChainId, {
        shouldTouch: true,
      });
      setValue(SwapFormKeyHelper.getAmountKey(formType), '');
      const oppositeFormType = formType === 'from' ? 'to' : 'from';
      const [selectedOppositeToken, selectedOppositeChainId] = getValues([
        SwapFormKeyHelper.getTokenKey(oppositeFormType),
        SwapFormKeyHelper.getChainKey(oppositeFormType),
      ]);
      if (
        selectedOppositeToken === tokenAddress &&
        selectedOppositeChainId === selectedChainId
      ) {
        setValue(SwapFormKeyHelper.getTokenKey(oppositeFormType), '', {
          shouldTouch: true,
        });
      }
      onClick?.();
    },
    [formType, getValues, onClick, setValue],
  );
};

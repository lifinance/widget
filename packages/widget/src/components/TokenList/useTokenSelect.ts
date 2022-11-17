import { useCallback } from 'react';
import { useController, useFormContext } from 'react-hook-form';
import type { SwapFormType } from '../../providers';
import { SwapFormKeyHelper } from '../../providers';

export const useTokenSelect = (
  formType: SwapFormType,
  onClick?: () => void,
) => {
  const tokenKey = SwapFormKeyHelper.getTokenKey(formType);
  const {
    field: { onChange, onBlur },
  } = useController({ name: tokenKey });
  const { setValue, getValues } = useFormContext();

  return useCallback(
    (tokenAddress: string, chainId?: number) => {
      onChange(tokenAddress);
      onBlur();
      const selectedChainId =
        chainId ?? getValues(SwapFormKeyHelper.getChainKey(formType));
      // Set chain again to trigger URL builder update
      setValue(SwapFormKeyHelper.getChainKey(formType), selectedChainId, {
        shouldDirty: true,
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
          shouldDirty: true,
          shouldTouch: true,
        });
      }
      onClick?.();
    },
    [formType, getValues, onBlur, onChange, onClick, setValue],
  );
};

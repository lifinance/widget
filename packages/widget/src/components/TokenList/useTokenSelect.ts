import { useCallback } from 'react';
import { useController, useFormContext } from 'react-hook-form';
import type { FormType } from '../../providers';
import { FormKeyHelper } from '../../providers';

export const useTokenSelect = (formType: FormType, onClick?: () => void) => {
  const tokenKey = FormKeyHelper.getTokenKey(formType);
  const {
    field: { onChange, onBlur },
  } = useController({ name: tokenKey });
  const { setValue, getValues } = useFormContext();

  return useCallback(
    (tokenAddress: string, chainId?: number) => {
      onChange(tokenAddress);
      onBlur();
      const selectedChainId =
        chainId ?? getValues(FormKeyHelper.getChainKey(formType));
      // Set chain again to trigger URL builder update
      setValue(FormKeyHelper.getChainKey(formType), selectedChainId, {
        shouldDirty: true,
        shouldTouch: true,
      });
      setValue(FormKeyHelper.getAmountKey(formType), '');
      const oppositeFormType = formType === 'from' ? 'to' : 'from';
      const [selectedOppositeToken, selectedOppositeChainId] = getValues([
        FormKeyHelper.getTokenKey(oppositeFormType),
        FormKeyHelper.getChainKey(oppositeFormType),
      ]);
      if (
        selectedOppositeToken === tokenAddress &&
        selectedOppositeChainId === selectedChainId
      ) {
        setValue(FormKeyHelper.getTokenKey(oppositeFormType), '', {
          shouldDirty: true,
          shouldTouch: true,
        });
      }
      onClick?.();
    },
    [formType, getValues, onBlur, onChange, onClick, setValue],
  );
};

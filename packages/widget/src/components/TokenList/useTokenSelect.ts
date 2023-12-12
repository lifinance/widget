import { WidgetEvent, useWidgetEvents } from '@lifi/widget';
import { useCallback } from 'react';
import type { FormType } from '../../providers';
import { FormKeyHelper, useWidgetConfig } from '../../providers';
import { useFieldActions, useFieldController } from '../../stores';

export const useTokenSelect = (formType: FormType, onClick?: () => void) => {
  const tokenKey = FormKeyHelper.getTokenKey(formType);
  const { onChange, onBlur } = useFieldController({ name: tokenKey });
  const { setFieldValue, getFieldValues } = useFieldActions();
  const { subvariant } = useWidgetConfig();
  const emitter = useWidgetEvents();

  return useCallback(
    (tokenAddress: string, chainId?: number) => {
      onChange(tokenAddress);
      onBlur();
      const selectedChainId =
        chainId ?? getFieldValues(FormKeyHelper.getChainKey(formType))[0];
      // Set chain again to trigger URL builder update
      setFieldValue(FormKeyHelper.getChainKey(formType), selectedChainId, {
        isDirty: true,
        isTouched: true,
      });
      setFieldValue(FormKeyHelper.getAmountKey(formType), '');
      const oppositeFormType = formType === 'from' ? 'to' : 'from';
      const [selectedOppositeToken, selectedOppositeChainId] = getFieldValues(
        FormKeyHelper.getTokenKey(oppositeFormType),
        FormKeyHelper.getChainKey(oppositeFormType),
      );
      if (
        selectedOppositeToken === tokenAddress &&
        selectedOppositeChainId === selectedChainId &&
        subvariant !== 'nft'
      ) {
        setFieldValue(FormKeyHelper.getTokenKey(oppositeFormType), '', {
          isDirty: true,
          isTouched: true,
        });
      }

      const eventToEmit =
        formType === 'from'
          ? WidgetEvent.SourceChainTokenSelected
          : WidgetEvent.DestinationChainTokenSelected;

      emitter.emit(eventToEmit, {
        chainId: selectedChainId,
        tokenAddress,
      });

      onClick?.();
    },
    [
      emitter,
      formType,
      getFieldValues,
      onBlur,
      onChange,
      onClick,
      setFieldValue,
      subvariant,
    ],
  );
};

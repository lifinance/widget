import { useCallback } from 'react';
import { useWidgetEvents } from '../../hooks/useWidgetEvents.js';
import { useWidgetConfig } from '../../providers/WidgetProvider/WidgetProvider.js';
import type { FormType } from '../../stores/form/types.js';
import { FormKeyHelper } from '../../stores/form/types.js';
import { useFieldActions } from '../../stores/form/useFieldActions.js';
import { useFieldController } from '../../stores/form/useFieldController.js';
import { WidgetEvent } from '../../types/events.js';

export const useTokenSelect = (formType: FormType, onClick?: () => void) => {
  const tokenKey = FormKeyHelper.getTokenKey(formType);
  const { onChange } = useFieldController({ name: tokenKey });
  const { setFieldValue, getFieldValues } = useFieldActions();
  const { subvariant } = useWidgetConfig();
  const emitter = useWidgetEvents();

  return useCallback(
    (tokenAddress: string, chainId?: number) => {
      onChange(tokenAddress);
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

      if (selectedChainId) {
        emitter.emit(eventToEmit, {
          chainId: selectedChainId,
          tokenAddress,
        });
      }

      onClick?.();
    },
    [
      emitter,
      formType,
      getFieldValues,
      onChange,
      onClick,
      setFieldValue,
      subvariant,
    ],
  );
};

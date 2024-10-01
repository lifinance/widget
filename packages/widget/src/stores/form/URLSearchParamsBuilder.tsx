import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useWidgetEvents } from '../../hooks/useWidgetEvents.js';
import { WidgetEvent } from '../../types/events.js';
import type { FormFieldNames } from '../form/types.js';
import { useFieldValues } from '../form/useFieldValues.js';
import { useTouchedFields } from '../form/useTouchedFields.js';

const formValueKeys: FormFieldNames[] = [
  'fromAmount',
  'fromChain',
  'fromToken',
  'toAddress',
  'toChain',
  'toToken',
];

export const URLSearchParamsBuilder = () => {
  const { pathname } = useLocation();
  const touchedFields = useTouchedFields();
  const values = useFieldValues(...formValueKeys);
  const emitter = useWidgetEvents();
  const location = useLocation();

  useEffect(() => {
    const url = new URL(window.location as any);
    formValueKeys.forEach((key, index) => {
      const value = values[index];
      if (touchedFields[key] && value) {
        url.searchParams.set(key, value.toString());
      } else if (url.searchParams.has(key) && !values[index]) {
        url.searchParams.delete(key);
      }
    });
    url.searchParams.sort();
    window.history.replaceState(window.history.state, '', url);
    emitter.emit(WidgetEvent.PageEntered, location.pathname);
  }, [emitter, location.pathname, pathname, touchedFields, values]);

  return null;
};

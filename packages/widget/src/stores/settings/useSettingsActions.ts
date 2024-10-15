import type { WidgetConfig } from '@lifi/widget';
import { deepEqual } from '@lifi/widget/utils/deepEqual.js';
import { useCallback } from 'react';
import { shallow } from 'zustand/shallow';
import { useWidgetEvents } from '../../hooks/useWidgetEvents.js';
import { WidgetEvent } from '../../types/events.js';
import type { SettingsProps, ValueSetter } from './types.js';
import {
  defaultConfigurableSettings,
  useSettingsStore,
} from './useSettingsStore.js';

export const useSettingsActions = () => {
  const emitter = useWidgetEvents();
  const actions = useSettingsStore(
    (state) => ({
      setValue: state.setValue,
      getValue: state.getValue,
      getStateValues: state.getStateValues,
      reset: state.reset,
    }),
    shallow,
  );

  const setValueWithEmittedEvent = useCallback<ValueSetter<SettingsProps>>(
    (value, newValue) => {
      const setting = value as keyof SettingsProps;
      const oldValue = actions.getValue(setting);

      actions.setValue(setting, newValue);

      if (newValue !== oldValue) {
        emitter.emit(WidgetEvent.SettingUpdated, {
          setting,
          newValue,
          oldValue,
        });
      }
    },
    [emitter, actions],
  );

  const setDefaultSettings = useCallback(
    (config?: WidgetConfig) => {
      const slippage = actions.getValue('slippage');
      const routePriority = actions.getValue('routePriority');
      const gasPrice = actions.getValue('gasPrice');

      const defaultSlippage =
        (config?.slippage || config?.sdkConfig?.routeOptions?.slippage || 0) *
        100;
      const defaultRoutePriority =
        config?.routePriority || config?.sdkConfig?.routeOptions?.order;

      defaultConfigurableSettings.slippage = (
        defaultSlippage || defaultConfigurableSettings.slippage
      )?.toString();

      defaultConfigurableSettings.routePriority =
        defaultRoutePriority || defaultConfigurableSettings.routePriority;

      if (!slippage) {
        setValueWithEmittedEvent(
          'slippage',
          defaultConfigurableSettings.slippage,
        );
      }
      if (!routePriority) {
        setValueWithEmittedEvent(
          'routePriority',
          defaultConfigurableSettings.routePriority,
        );
      }
      if (!gasPrice) {
        setValueWithEmittedEvent(
          'gasPrice',
          defaultConfigurableSettings.gasPrice,
        );
      }
    },
    [actions, setValueWithEmittedEvent],
  );

  const resetWithEmittedEvents = useCallback(
    (bridges: string[], exchanges: string[]) => {
      const oldStateValues = actions.getStateValues();

      actions.reset(bridges, exchanges);

      const newStateValues = actions.getStateValues();

      if (!deepEqual(oldStateValues, newStateValues)) {
        (Object.keys(oldStateValues) as (keyof SettingsProps)[]).forEach(
          (toolKey) => {
            if (!deepEqual(oldStateValues[toolKey], newStateValues[toolKey])) {
              emitter.emit(WidgetEvent.SettingUpdated, {
                setting: toolKey,
                newValue: newStateValues[toolKey],
                oldValue: oldStateValues[toolKey],
              });
            }
          },
        );
      }
    },
    [emitter, actions],
  );

  return {
    setValue: setValueWithEmittedEvent,
    setDefaultSettings,
    resetSettings: resetWithEmittedEvents,
  };
};

import { useCallback } from 'react';
import { shallow } from 'zustand/shallow';
import type { widgetEvents } from '../../hooks/useWidgetEvents.js';
import { useWidgetEvents } from '../../hooks/useWidgetEvents.js';
import { WidgetEvent } from '../../types/events.js';
import type { WidgetConfig } from '../../types/widget.js';
import { deepEqual } from '../../utils/deepEqual.js';
import type { SettingsProps, SettingsToolType, ValueSetter } from './types.js';
import {
  defaultConfigurableSettings,
  useSettingsStore,
} from './useSettingsStore.js';

const emitChangedStateValues = (
  emitter: typeof widgetEvents,
  oldSettings: SettingsProps,
  newSettings: SettingsProps,
) => {
  if (!deepEqual(oldSettings, newSettings)) {
    (Object.keys(oldSettings) as (keyof SettingsProps)[]).forEach((toolKey) => {
      if (!deepEqual(oldSettings[toolKey], newSettings[toolKey])) {
        emitter.emit(WidgetEvent.SettingUpdated, {
          setting: toolKey,
          newValue: newSettings[toolKey],
          oldValue: oldSettings[toolKey],
          newSettings: newSettings,
          oldSettings: oldSettings,
        });
      }
    });
  }
};

export const useSettingsActions = () => {
  const emitter = useWidgetEvents();
  const actions = useSettingsStore(
    (state) => ({
      setValue: state.setValue,
      getValue: state.getValue,
      getSettings: state.getSettings,
      reset: state.reset,
      setToolValue: state.setToolValue,
      toggleToolKeys: state.toggleToolKeys,
    }),
    shallow,
  );

  const setValueWithEmittedEvent = useCallback<ValueSetter<SettingsProps>>(
    (value, newValue) => {
      const setting = value as keyof SettingsProps;
      const oldValue = actions.getValue(setting);
      const oldSettings = actions.getSettings();

      actions.setValue(setting, newValue);

      const newSettings = actions.getSettings();

      if (newValue !== oldValue) {
        emitter.emit(WidgetEvent.SettingUpdated, {
          setting,
          newValue,
          oldValue,
          newSettings,
          oldSettings,
        });
      }
    },
    [emitter, actions],
  );

  const setDefaultSettingsWithEmittedEvents = useCallback(
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
      const oldSettings = actions.getSettings();

      actions.reset(bridges, exchanges);

      const newSettings = actions.getSettings();

      emitChangedStateValues(emitter, oldSettings, newSettings);
    },
    [emitter, actions],
  );

  const setToolValueWithEmittedEvents = useCallback(
    (toolType: SettingsToolType, tool: string, value: boolean) => {
      const oldSettings = actions.getSettings();

      actions.setToolValue(toolType, tool, value);

      const newSettings = actions.getSettings();

      emitChangedStateValues(emitter, oldSettings, newSettings);
    },
    [emitter, actions],
  );

  const toggleToolKeysWithEmittedEvents = useCallback(
    (toolType: SettingsToolType, toolKeys: string[]) => {
      const oldSettings = actions.getSettings();

      actions.toggleToolKeys(toolType, toolKeys);

      const newSettings = actions.getSettings();

      emitChangedStateValues(emitter, oldSettings, newSettings);
    },
    [emitter, actions],
  );

  return {
    setValue: setValueWithEmittedEvent,
    setDefaultSettings: setDefaultSettingsWithEmittedEvents,
    resetSettings: resetWithEmittedEvents,
    setToolValue: setToolValueWithEmittedEvents,
    toggleToolKeys: toggleToolKeysWithEmittedEvents,
  };
};

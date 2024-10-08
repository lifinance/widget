import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { shallow } from 'zustand/shallow';
import { useWidgetEvents } from '../hooks/useWidgetEvents.js';
import type { SettingsProps } from '../stores/settings/types.js';
import { useSettingsStore } from '../stores/settings/useSettingsStore.js';
import { WidgetEvent } from '../types/events.js';
import { deepEqual } from '../utils/deepEquality.js';

export function PageEntered() {
  const location = useLocation();
  const emitter = useWidgetEvents();
  const lastLocation = useRef<string | undefined>();
  const getSettingsState = useSettingsStore(
    (state) => state.getSettingsState,
    shallow,
  );

  const previousSettings = useRef<SettingsProps | undefined>();

  useEffect(() => {
    const previousPathname = lastLocation.current;
    const currentPathname = location.pathname;

    emitter.emit(WidgetEvent.PageEntered, location.pathname);

    if (
      currentPathname === '/settings' &&
      !previousPathname?.includes('/settings')
    ) {
      // this is the entry point to settings, setting can have subpages for bridges, exchanges and languages
      // so we have to check that the user didn't come from a child page
      // we capture the initialSettingState
      previousSettings.current = getSettingsState();
    } else if (
      !currentPathname.includes('/settings') &&
      previousPathname === '/settings'
    ) {
      // this is the exit point to settings, setting can have subpages for bridges, exchanges and languages
      // so we have to check that the user didn't navigate to a child page
      const currentSettings = getSettingsState();
      if (
        previousSettings.current &&
        !deepEqual(previousSettings.current, currentSettings)
      ) {
        emitter.emit(WidgetEvent.SettingsUpdated, {
          currentSettings: currentSettings,
          previousSettings: previousSettings.current,
        });
        previousSettings.current = undefined;
      }
    }

    return () => {
      lastLocation.current = location.pathname;
    };
  }, [emitter, location.pathname, getSettingsState]);

  return null;
}

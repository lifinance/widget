import microdiff from 'microdiff';
import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { shallow } from 'zustand/shallow';
import { useWidgetEvents } from '../hooks/useWidgetEvents.js';
import type { SettingsValues } from '../stores/settings/types.js';
import { useSettingsStore } from '../stores/settings/useSettingsStore.js';
import { WidgetEvent } from '../types/events.js';
import { deepEqual } from '../utils/deepEquality.js';

const isNotSettingsSubpage = (pathname?: string) =>
  !pathname?.includes('/settings') && !pathname?.includes('/select-wallet');

export function PageEntered() {
  const location = useLocation();
  const emitter = useWidgetEvents();
  const lastLocation = useRef<string | undefined>();
  const getSettings = useSettingsStore((state) => state.getSettings, shallow);

  const previousSettings = useRef<SettingsValues | undefined>();

  useEffect(() => {
    const previousPathname = lastLocation.current;
    const currentPathname = location.pathname;

    emitter.emit(WidgetEvent.PageEntered, location.pathname);

    // SettingsUpdated logic
    if (
      currentPathname === '/settings' &&
      isNotSettingsSubpage(previousPathname)
    ) {
      // The first if detects the user entering the settings page and captures the settings state
      //   From this settings section the user can navigate from these subpages without meaningfully leaving the settings section
      //   - bridges - /settings/bridges
      //   - exchanges - /settings/exchanges
      //   - languages - /settings/languages
      //   - select wallet pages - /select-wallet
      //   We check that the location the user came from is not one of these pages
      //   in order to avoid re-capturing the settings state again
      previousSettings.current = getSettings();
    } else if (
      isNotSettingsSubpage(currentPathname) &&
      previousPathname === '/settings'
    ) {
      // The second if detects the user leaving the settings page and checks the settings state against the
      // state captured when the user entered the settings, emitting a SettingsUpdated event if there has been
      // any settings changed.
      //   From this section the user can navigate to these subpages without leave the settings section
      //   - bridges - /settings/bridges
      //   - exchanges - /settings/exchanges
      //   - languages - /settings/languages
      //   - select wallet pages - /select-wallet
      //   We check that the location the user navigated to is not one of these pages
      //   in order ensure we emit the SettingsUpdated event at the point the user meaningfully leaves the Settings
      const currentSettings = getSettings();
      if (
        previousSettings.current &&
        !deepEqual(previousSettings.current, currentSettings)
      ) {
        emitter.emit(WidgetEvent.SettingsUpdated, {
          currentSettings: currentSettings,
          previousSettings: previousSettings.current,
          diff: microdiff(previousSettings.current, currentSettings),
        });
        previousSettings.current = undefined;
      }
    }

    return () => {
      lastLocation.current = location.pathname;
    };
  }, [emitter, location.pathname, getSettings]);

  return null;
}

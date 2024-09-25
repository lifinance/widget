import { useCallback } from 'react';
import type { NavigateFunction, To } from 'react-router-dom';
import { useLocation, useNavigate as useRRDNavigate } from 'react-router-dom';
import { WidgetEvent } from '../types/events.js';
import type { NavigationRouteType } from '../utils/navigationRoutes.js';
import { useWidgetEvents } from './useWidgetEvents.js';

export const useNavigate = (): NavigateFunction => {
  const navigate = useRRDNavigate();
  const location = useLocation(); // Access the current location
  const emitter = useWidgetEvents();

  const customNavigate: NavigateFunction = useCallback(
    (to: To | number, options?: { replace?: boolean; state?: any }) => {
      if (typeof to === 'number') {
        // Handle numeric 'to' parameter (delta) by calling the original navigate
        navigate(to);
      } else {
        // Check if the path is different from the current location to avoid emitting unnecessarily
        const targetPath = typeof to === 'string' ? to : to.pathname || '';
        if (targetPath && targetPath !== location.pathname) {
          emitter.emit(
            WidgetEvent.PageEntered,
            targetPath as NavigationRouteType,
          );
        }

        // Call the original navigate function with the same parameters
        navigate(to, options);
      }
    },
    [emitter, navigate, location.pathname],
  );

  return customNavigate;
};

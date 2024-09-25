import { useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { WidgetEvent } from '../types/events.js';
import type { NavigationRouteType } from '../utils/navigationRoutes.js';
import { useNavigate } from './useNavigate.js';
import { useWidgetEvents } from './useWidgetEvents.js';

const getPreviousPath = (pathname: string) => {
  // cut current page from pathname
  const removeCurrentPage = pathname.substring(0, pathname.lastIndexOf('/'));
  // get 2nd last page from pathname
  const formattedString = removeCurrentPage.substring(
    removeCurrentPage.lastIndexOf('/') + 1,
  );
  return formattedString;
};

export const useNavigateBack = () => {
  const navigate = useNavigate();
  const emitter = useWidgetEvents();
  const location = useLocation();
  const path = getPreviousPath(location.pathname);

  const navigateBack = useCallback(() => {
    // TODO: find a better router with nested memory routers support
    // https://github.com/remix-run/react-router/pull/9112
    // https://github.com/remix-run/react-router/discussions/9601
    //
    // if (window.history.length > 2) {
    navigate(-1);
    if (path) {
      emitter.emit(WidgetEvent.PageEntered, path as NavigationRouteType);
    }

    // } else {
    //   navigate(
    //     window.location.pathname.substring(
    //       0,
    //       window.location.pathname.lastIndexOf('/'),
    //     ) || '/',
    //     { replace: true },
    //   );
    // }
  }, [emitter, navigate, path]);

  return { navigateBack, navigate };
};

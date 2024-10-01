import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

export const useNavigateBack = () => {
  const navigate = useNavigate();

  const navigateBack = useCallback(() => {
    // TODO: find a better router with nested memory routers support
    // https://github.com/remix-run/react-router/pull/9112
    // https://github.com/remix-run/react-router/discussions/9601
    //
    // if (window.history.length > 2) {
    navigate(-1);
    // } else {
    //   navigate(
    //     window.location.pathname.substring(
    //       0,
    //       window.location.pathname.lastIndexOf('/'),
    //     ) || '/',
    //     { replace: true },
    //   );
    // }
  }, [navigate]);

  return { navigateBack, navigate };
};

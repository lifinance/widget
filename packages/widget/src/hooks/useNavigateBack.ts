import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

export const useNavigateBack = () => {
  const navigate = useNavigate();

  const navigateBack = useCallback(() => {
    if (window.history.state && window.history.state.idx > 0) {
      navigate(-1);
    } else {
      navigate(
        window.location.pathname.substring(
          0,
          window.location.pathname.lastIndexOf('/'),
        ) || '/',
        { replace: true },
      );
    }
  }, [navigate]);

  return { navigateBack, navigate };
};

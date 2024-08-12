import { useEffect, useState } from 'react';

const getQueryStringParam = () => {
  // Client-side-only code
  if (typeof window !== 'undefined') {
    const urlParams = new URLSearchParams(window.location.search);
    return !!urlParams.get('devView') || false;
  }
  return false;
};

export const useDevView = () => {
  const [isDevView, setIsDevView] = useState(false);

  useEffect(() => {
    setIsDevView(getQueryStringParam());
  }, []);

  return {
    isDevView,
  };
};

export const useDevView = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const isDevView = !!urlParams.get('devView') || false;

  return {
    isDevView,
  };
};

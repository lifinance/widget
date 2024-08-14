import { shallow } from 'zustand/shallow';
import { useEditToolsActions, useEditToolsStore } from '../store';

const queryStringKey = 'devView';

const setQueryStringParam = (value: boolean) => {
  const url = new URL(window.location.href);
  if (value) {
    url.searchParams.set(queryStringKey, value.toString());
  } else {
    url.searchParams.delete(queryStringKey);
  }
  window.history.pushState(null, '', url.toString());
};

export const useDevView = () => {
  const [isDevView] = useEditToolsStore((store) => [store.isDevView], shallow);
  const { setIsDevView } = useEditToolsActions();

  const toggleDevView = () => {
    const newDevViewValue = !isDevView;
    setQueryStringParam(newDevViewValue);
    setIsDevView(newDevViewValue);
  };

  return {
    isDevView,
    toggleDevView,
  };
};

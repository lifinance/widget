import { shallow } from 'zustand/shallow';
import { useEditToolsStore } from './EditToolsProvider';

export const useCodeToolsValues = () => {
  const [codeControlTab] = useEditToolsStore(
    (store) => [store.codeControl.openTab],
    shallow,
  );

  return {
    codeControlTab,
  };
};

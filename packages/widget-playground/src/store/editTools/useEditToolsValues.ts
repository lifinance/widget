import { shallow } from 'zustand/shallow';
import { useEditToolsStore } from './EditToolsProvider';

export const useEditToolsValues = () => {
  const [open] = useEditToolsStore((store) => [store.drawer?.open], shallow);

  return {
    isDrawerOpen: open,
  };
};

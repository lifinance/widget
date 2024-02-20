import { shallow } from 'zustand/shallow';
import { useEditToolsStore } from './EditToolsProvider';

export const useEditToolsActions = () => {
  const actions = useEditToolsStore(
    (state) => ({
      setDrawerOpen: state.setDrawerOpen,
    }),
    shallow,
  );

  return actions;
};

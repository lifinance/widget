import { shallow } from 'zustand/shallow';
import { useEditToolsStore } from './EditToolsProvider';

export const useEditToolsActions = () => {
  const actions = useEditToolsStore(
    (state) => ({
      setDrawerOpen: state.setDrawerOpen,
      setCodeDrawerWidth: state.setCodeDrawerWidth,
      setVisibleControls: state.setVisibleControls,
      resetEditTools: state.resetEditTools,
    }),
    shallow,
  );

  return actions;
};

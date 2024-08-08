import { shallow } from 'zustand/shallow';
import { useEditToolsStore } from './EditToolsProvider';

export const useEditToolsActions = () => {
  const actions = useEditToolsStore(
    (state) => ({
      setDrawerOpen: state.setDrawerOpen,
      setCodeDrawerWidth: state.setCodeDrawerWidth,
      setVisibleControls: state.setVisibleControls,
      setCodeControlTab: state.setCodeControlTab,
      resetEditTools: state.resetEditTools,
      setSelectedFont: state.setSelectedFont,
      setViewportBackgroundColor: state.setViewportBackgroundColor,
      setSkeletonShow: state.setSkeletonShow,
      setSkeletonSideBySide: state.setSkeletonSideBySide,
      setHeaderShow: state.setHeaderShow,
      setFooterShow: state.setFooterShow,
    }),
    shallow,
  );

  return actions;
};

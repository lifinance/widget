import { useEditToolsStore } from './EditToolsProvider.js'

import type { ToolsState } from './types.js'

export const useEditToolsActions = (): Pick<
  ToolsState,
  | 'setDrawerOpen'
  | 'setCodeDrawerWidth'
  | 'setVisibleControls'
  | 'setCodeControlTab'
  | 'resetEditTools'
  | 'setSelectedFont'
  | 'setViewportBackgroundColor'
  | 'setSkeletonShow'
  | 'setSkeletonSideBySide'
  | 'setHeaderVisibility'
  | 'setFooterVisibility'
  | 'setFixedFooter'
  | 'setSelectedLayoutId'
  | 'setIsDevView'
  | 'setFormValues'
> => {
  const actions = useEditToolsStore((state) => ({
    setDrawerOpen: state.setDrawerOpen,
    setCodeDrawerWidth: state.setCodeDrawerWidth,
    setVisibleControls: state.setVisibleControls,
    setCodeControlTab: state.setCodeControlTab,
    resetEditTools: state.resetEditTools,
    setSelectedFont: state.setSelectedFont,
    setViewportBackgroundColor: state.setViewportBackgroundColor,
    setSkeletonShow: state.setSkeletonShow,
    setSkeletonSideBySide: state.setSkeletonSideBySide,
    setHeaderVisibility: state.setHeaderVisibility,
    setFooterVisibility: state.setFooterVisibility,
    setFixedFooter: state.setFixedFooter,
    setSelectedLayoutId: state.setSelectedLayoutId,
    setIsDevView: state.setIsDevView,
    setFormValues: state.setFormValues,
  }))

  return actions
}

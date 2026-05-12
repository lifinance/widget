import { useEditToolsStore } from './EditToolsProvider.js'

import type { ToolsState } from './types.js'

export const useEditToolsActions = (): Pick<
  ToolsState,
  | 'setDrawerOpen'
  | 'resetEditTools'
  | 'setSelectedFont'
  | 'setViewportBackgroundColor'
  | 'setSkeletonShow'
  | 'setHeaderVisibility'
  | 'setFooterVisibility'
  | 'setFixedFooter'
  | 'setSelectedLayoutId'
  | 'setIsDevView'
  | 'setFormValues'
> => {
  const actions = useEditToolsStore((state) => ({
    setDrawerOpen: state.setDrawerOpen,
    resetEditTools: state.resetEditTools,
    setSelectedFont: state.setSelectedFont,
    setViewportBackgroundColor: state.setViewportBackgroundColor,
    setSkeletonShow: state.setSkeletonShow,
    setHeaderVisibility: state.setHeaderVisibility,
    setFooterVisibility: state.setFooterVisibility,
    setFixedFooter: state.setFixedFooter,
    setSelectedLayoutId: state.setSelectedLayoutId,
    setIsDevView: state.setIsDevView,
    setFormValues: state.setFormValues,
  }))

  return actions
}

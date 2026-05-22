import { useCallback } from 'react'
import { useEditToolsStore } from '../store/editTools/EditToolsProvider.js'
import { useEditToolsActions } from '../store/editTools/useEditToolsActions.js'
import { setQueryStringParam } from '../utils/setQueryStringParam.js'

const queryStringKey = 'devView'

export const useDevView = (): {
  isDevView: boolean
  toggleDevView: () => void
} => {
  const isDevView = useEditToolsStore((store) => store.isDevView)
  const { setIsDevView } = useEditToolsActions()

  const toggleDevView = useCallback(() => {
    const newDevViewValue = !isDevView
    setQueryStringParam(queryStringKey, newDevViewValue)
    setIsDevView(newDevViewValue)
  }, [isDevView, setIsDevView])

  return {
    isDevView,
    toggleDevView,
  }
}

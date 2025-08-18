import { useEditToolsStore } from '../store/editTools/EditToolsProvider.js'
import { useEditToolsActions } from '../store/editTools/useEditToolsActions.js'
import { setQueryStringParam } from '../utils/setQueryStringParam.js'

const queryStringKey = 'devView'

export const useDevView = () => {
  const isDevView = useEditToolsStore((store) => store.isDevView)
  const { setIsDevView } = useEditToolsActions()

  const toggleDevView = () => {
    const newDevViewValue = !isDevView
    setQueryStringParam(queryStringKey, newDevViewValue)
    setIsDevView(newDevViewValue)
  }

  return {
    isDevView,
    toggleDevView,
  }
}

import { shallow } from 'zustand/shallow'
import { useEditToolsStore } from '../store/editTools/EditToolsProvider'
import { useEditToolsActions } from '../store/editTools/useEditToolsActions'
import { setQueryStringParam } from '../utils/setQueryStringParam'

const queryStringKey = 'devView'

export const useDevView = () => {
  const [isDevView] = useEditToolsStore((store) => [store.isDevView], shallow)
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

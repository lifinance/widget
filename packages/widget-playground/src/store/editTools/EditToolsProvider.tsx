import type { FC, PropsWithChildren } from 'react'
import { createContext, useContext, useEffect, useRef } from 'react'
import { shallow } from 'zustand/shallow'
import { useConfigActions } from '../widgetConfig/useConfigActions'
import { createEditToolsStore } from './createEditToolsStore'
import type { ToolsState, ToolsStore } from './types'

const getIsDevViewQueryStringParam = () => {
  if (typeof window !== 'undefined') {
    const urlParams = new URLSearchParams(window.location.search)
    return !!urlParams.get('devView') || false
  }
  return false
}

export const EditToolsContext = createContext<ToolsStore | null>(null)

export const EditToolsProvider: FC<PropsWithChildren> = ({ children }) => {
  const storeRef = useRef<ToolsStore>(null)
  const { getCurrentThemePreset } = useConfigActions()

  if (!storeRef.current) {
    storeRef.current = createEditToolsStore(getCurrentThemePreset())
  }

  useEffect(() => {
    if (storeRef.current) {
      storeRef.current.getState().setIsDevView(getIsDevViewQueryStringParam())
    }
  }, [])

  return (
    <EditToolsContext.Provider value={storeRef.current}>
      {children}
    </EditToolsContext.Provider>
  )
}

export function useEditToolsStore<T>(
  selector: (store: ToolsState) => T,
  equalityFunction = shallow
) {
  const useStore = useContext(EditToolsContext)

  if (!useStore) {
    throw new Error(
      `You forgot to wrap your component in <${EditToolsProvider.name}>.`
    )
  }

  return useStore(selector, equalityFunction)
}

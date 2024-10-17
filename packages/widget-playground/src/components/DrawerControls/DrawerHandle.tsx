import type { MouseEventHandler } from 'react'
import { useEffect, useState } from 'react'
import {
  defaultDrawerWidth,
  useCodeToolValues,
  useDrawerToolValues,
  useEditToolsActions,
} from '../../store'
import {
  DrawerHandleButton,
  DrawerIconLeft,
  DrawerIconRight,
} from './DrawerControls.style'

export const DrawerHandle = () => {
  const [isDrawerResizing, setIsDrawerResizing] = useState(false)
  const [drawResizeStartX, setDrawResizeStartX] = useState(0)
  const { codeControlTab } = useCodeToolValues()
  const { isDrawerOpen, drawerWidth, visibleControls } = useDrawerToolValues()
  const { setCodeDrawerWidth } = useEditToolsActions()

  const drawerHandleOnMouseDown: MouseEventHandler<HTMLButtonElement> = (e) => {
    setIsDrawerResizing(true)
    setDrawResizeStartX(e.clientX)
  }

  useEffect(() => {
    const drawerHandleOnMouseUp = () => {
      setIsDrawerResizing(false)
      setDrawResizeStartX(0)
    }
    const handleMousemove = (e: MouseEvent) => {
      if (!isDrawerResizing) {
        return
      }

      const newDrawerWidth = drawResizeStartX + (e.clientX - drawResizeStartX)

      setCodeDrawerWidth(
        newDrawerWidth >= defaultDrawerWidth
          ? drawResizeStartX + (e.clientX - drawResizeStartX)
          : defaultDrawerWidth
      )
    }
    document.addEventListener('mousemove', handleMousemove)
    document.addEventListener('mouseup', drawerHandleOnMouseUp)
    return () => {
      document.removeEventListener('mousemove', handleMousemove)
      document.removeEventListener('mouseup', drawerHandleOnMouseUp)
    }
  }, [isDrawerResizing, drawResizeStartX, setCodeDrawerWidth])

  return visibleControls === 'code' &&
    codeControlTab === 'config' &&
    isDrawerOpen ? (
    <>
      <DrawerHandleButton
        onMouseDown={drawerHandleOnMouseDown}
        sx={{
          width: isDrawerResizing ? 400 : 16,
          left: isDrawerResizing ? drawerWidth - 200 : drawerWidth,
        }}
      />
      <DrawerIconRight
        fontSize="small"
        sx={{
          left: drawerWidth - 4,
        }}
      />
      {drawerWidth !== defaultDrawerWidth ? (
        <DrawerIconLeft
          fontSize="small"
          sx={{
            left: drawerWidth,
          }}
        />
      ) : null}
    </>
  ) : null
}

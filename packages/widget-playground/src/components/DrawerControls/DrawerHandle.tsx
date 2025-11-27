import type { MouseEventHandler } from 'react'
import { useEffect, useState } from 'react'
import { defaultDrawerWidth } from '../../store/editTools/constants'
import { useCodeToolValues } from '../../store/editTools/useCodeToolValues'
import { useDrawerToolValues } from '../../store/editTools/useDrawerToolValues'
import { useEditToolsActions } from '../../store/editTools/useEditToolsActions'
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
        sx={[
          isDrawerResizing
            ? {
                width: 400,
              }
            : {
                width: 16,
              },
          isDrawerResizing
            ? {
                left: drawerWidth - 200,
              }
            : {
                left: drawerWidth,
              },
        ]}
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

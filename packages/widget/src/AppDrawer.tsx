import { Drawer } from '@mui/material'
import type { PropsWithChildren } from 'react'
import {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react'
import type { WidgetDrawerContext } from './AppDrawerContext.js'
import { DrawerContext } from './AppDrawerContext.js'
import type { WidgetDrawerProps } from './types/widget.js'

export interface WidgetDrawer {
  isOpen(): void
  toggleDrawer(): void
  openDrawer(): void
  closeDrawer(): void
}

export const AppDrawer = forwardRef<
  WidgetDrawer,
  PropsWithChildren<WidgetDrawerProps>
>(({ elementRef, open, onClose, children }, ref) => {
  const openRef = useRef(Boolean(open))
  const [drawerOpen, setDrawerOpen] = useState(Boolean(open))

  const toggleDrawer = useCallback(() => {
    setDrawerOpen((open) => {
      openRef.current = !open
      return openRef.current
    })
    if (!openRef.current) {
      onClose?.()
    }
  }, [onClose])

  const openDrawer = useCallback(() => {
    setDrawerOpen(true)
    openRef.current = true
  }, [])

  const closeDrawer = useCallback(() => {
    setDrawerOpen(false)
    openRef.current = false
    onClose?.()
  }, [onClose])

  useImperativeHandle(
    ref,
    () => ({
      isOpen: () => openRef.current,
      toggleDrawer,
      openDrawer,
      closeDrawer,
    }),
    [closeDrawer, openDrawer, toggleDrawer]
  )

  const drawerContext: WidgetDrawerContext = useMemo(
    () => ({
      closeDrawer,
    }),
    [closeDrawer]
  )

  return (
    <DrawerContext.Provider value={drawerContext}>
      <Drawer
        ref={elementRef}
        anchor="right"
        open={drawerOpen}
        onClose={closeDrawer}
        slotProps={{
          backdrop: {
            sx: {
              backgroundColor: 'rgb(0 0 0 / 48%)',
              backdropFilter: 'blur(3px)',
            },
          },
        }}
        PaperProps={{
          sx: (theme) => ({
            width: theme?.container?.width ?? '100%',
            minWidth: theme?.container?.minWidth ?? theme.breakpoints.values.xs,
            maxWidth: theme?.container?.maxWidth ?? theme.breakpoints.values.sm,
          }),
        }}
        keepMounted
      >
        {children}
      </Drawer>
    </DrawerContext.Provider>
  )
})

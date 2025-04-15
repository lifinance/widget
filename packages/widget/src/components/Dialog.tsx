import type { DialogProps, Theme } from '@mui/material'
import { Dialog as MuiDialog } from '@mui/material'
import type { PropsWithChildren } from 'react'
import { useGetScrollableContainer } from '../hooks/useScrollableContainer.js'

export const modalProps = {
  sx: {
    position: 'absolute',
    overflow: 'hidden',
  },
}

export const slotProps = {
  paper: {
    sx: (theme: Theme) => ({
      position: 'absolute',
      backgroundImage: 'none',
      backgroundColor: theme.palette.background.default,
      borderTopLeftRadius: theme.shape.borderRadius,
      borderTopRightRadius: theme.shape.borderRadius,
    }),
  },
  backdrop: {
    sx: {
      position: 'absolute',
      backgroundColor: 'rgb(0 0 0 / 32%)',
      backdropFilter: 'blur(3px)',
    },
  },
}

export const Dialog: React.FC<PropsWithChildren<DialogProps>> = ({
  children,
  open,
  onClose,
}) => {
  const getContainer = useGetScrollableContainer()
  return (
    <MuiDialog
      container={getContainer}
      open={open}
      onClose={onClose}
      sx={modalProps.sx}
      slotProps={slotProps}
    >
      {children}
    </MuiDialog>
  )
}

import type { Theme } from '@mui/material'
import { Dialog, Drawer, useMediaQuery } from '@mui/material'
import type { PropsWithChildren } from 'react'

export interface WalletMenuProps {
  open: boolean
  onClose: () => void
}

const maxWidth = 480

export const WalletMenuModal: React.FC<PropsWithChildren<WalletMenuProps>> = ({
  open,
  onClose,
  children,
}) => {
  const isMobile = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down(maxWidth)
  )

  return isMobile ? (
    <Drawer
      anchor="bottom"
      open={open}
      onClose={onClose}
      slotProps={{
        paper: {
          sx: (theme) => ({
            maxHeight: '80%',
            background: theme.vars.palette.background.default,
            borderTopLeftRadius: `calc(${theme.vars.shape.borderRadius} * 2)`,
            borderTopRightRadius: `calc(${theme.vars.shape.borderRadius} * 2)`,
          }),
        },
        backdrop: {
          sx: {
            backgroundColor: 'rgb(0 0 0 / 24%)',
            backdropFilter: 'blur(3px)',
          },
        },
      }}
    >
      {children}
    </Drawer>
  ) : (
    <Dialog
      open={open}
      onClose={onClose}
      scroll="paper"
      slotProps={{
        paper: {
          sx: (theme) => ({
            width: '100%',
            maxWidth: maxWidth,
            background: theme.vars.palette.background.default,
            borderTopLeftRadius: `calc(${theme.vars.shape.borderRadius} * 2)`,
            borderTopRightRadius: `calc(${theme.vars.shape.borderRadius} * 2)`,
            borderBottomLeftRadius: `calc(${theme.vars.shape.borderRadius} * 2)`,
            borderBottomRightRadius: `calc(${theme.vars.shape.borderRadius} * 2)`,
          }),
        },
        backdrop: {
          sx: {
            backgroundColor: 'rgb(0 0 0 / 24%)',
            backdropFilter: 'blur(3px)',
          },
        },
      }}
    >
      {children}
    </Dialog>
  )
}

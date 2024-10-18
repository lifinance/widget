import type { Theme } from '@mui/material'
import { Dialog, Drawer, useMediaQuery } from '@mui/material'
import type { PropsWithChildren } from 'react'

export interface WalletMenuProps {
  open: boolean
  onClose: () => void
}

const maxWidth = 460

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
      PaperProps={{
        sx: (theme) => ({
          maxHeight: '80%',
          background: theme.palette.background.default,
          borderTopLeftRadius: theme.shape.borderRadius * 2,
          borderTopRightRadius: theme.shape.borderRadius * 2,
        }),
      }}
      slotProps={{
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
      PaperProps={{
        sx: (theme) => ({
          width: '100%',
          maxWidth: maxWidth,
          background: theme.palette.background.default,
          borderTopLeftRadius: theme.shape.borderRadius * 2,
          borderTopRightRadius: theme.shape.borderRadius * 2,
          borderBottomLeftRadius: theme.shape.borderRadius * 2,
          borderBottomRightRadius: theme.shape.borderRadius * 2,
        }),
      }}
      slotProps={{
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

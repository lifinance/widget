import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import type { IconButtonProps } from '@mui/material'
import {
  Button,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  MenuItem,
  useTheme,
} from '@mui/material'
import { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Dialog } from '../../components/Dialog.js'
import { Menu } from '../../components/Menu.js'
import { useRouteExecutionStore } from '../../stores/routes/RouteExecutionStore.js'
import { RouteExecutionStatus } from '../../stores/routes/types.js'

export const ActivitiesPageMenuButton: React.FC<IconButtonProps> = () => {
  const hasFailedItems = useRouteExecutionStore((state) =>
    Object.values(state.routes).some(
      (r) => r?.status === RouteExecutionStatus.Failed
    )
  )
  const theme = useTheme()
  const { t } = useTranslation()
  const anchorEl = useRef<HTMLButtonElement | null>(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)
  const deleteRoutes = useRouteExecutionStore((store) => store.deleteRoutes)

  if (!hasFailedItems) {
    return null
  }

  const handleMenuOpen = () => setMenuOpen(true)
  const handleMenuClose = () => setMenuOpen(false)

  const handleDialogOpen = () => {
    handleMenuClose()
    setDialogOpen(true)
  }
  const handleDialogClose = () => setDialogOpen(false)

  const handleRemoveAllFailed = () => {
    deleteRoutes('failed')
    handleDialogClose()
  }

  return (
    <>
      <IconButton
        ref={anchorEl}
        size="medium"
        edge={theme?.navigation?.edge ? 'end' : false}
        onClick={handleMenuOpen}
      >
        <MoreVertIcon />
      </IconButton>
      <Menu
        anchorEl={anchorEl.current}
        open={menuOpen}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleDialogOpen}>
          <DeleteOutlineIcon />
          {t('button.removeAllFailed')}
        </MenuItem>
      </Menu>
      <Dialog open={dialogOpen} onClose={handleDialogClose}>
        <DialogTitle>{t('warning.title.deleteFailedTransactions')}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {t('warning.message.deleteFailedTransactions')}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>{t('button.cancel')}</Button>
          <Button variant="contained" onClick={handleRemoveAllFailed} autoFocus>
            {t('button.delete')}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

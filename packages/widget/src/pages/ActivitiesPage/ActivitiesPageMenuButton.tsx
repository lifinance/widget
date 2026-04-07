import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import { Button } from '@mui/material'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ContextMenu } from '../../components/ContextMenu.js'
import { Dialog } from '../../components/Dialog/Dialog.js'
import {
  DialogActions,
  DialogContainer,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '../../components/Dialog/Dialog.style.js'
import { useRouteExecutionStore } from '../../stores/routes/RouteExecutionStore.js'

export const ActivitiesPageMenuButton: React.FC = () => {
  const { t } = useTranslation()
  const [dialogOpen, setDialogOpen] = useState(false)
  const deleteRoutes = useRouteExecutionStore((store) => store.deleteRoutes)

  const handleDialogOpen = () => setDialogOpen(true)
  const handleDialogClose = () => setDialogOpen(false)

  const handleRemoveAllFailed = () => {
    deleteRoutes('failed')
    handleDialogClose()
  }

  return (
    <>
      <ContextMenu
        buttonSx={{ position: 'static', marginRight: -1.5 }}
        items={[
          {
            icon: <DeleteOutlineIcon />,
            label: t('button.removeAllFailed'),
            onClick: handleDialogOpen,
          },
        ]}
      />
      <Dialog open={dialogOpen} onClose={handleDialogClose}>
        <DialogContainer>
          <DialogTitle>
            {t('warning.title.deleteFailedTransactions')}
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              {t('warning.message.deleteFailedTransactions')}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDialogClose}>{t('button.cancel')}</Button>
            <Button
              variant="contained"
              onClick={handleRemoveAllFailed}
              autoFocus
            >
              {t('button.delete')}
            </Button>
          </DialogActions>
        </DialogContainer>
      </Dialog>
    </>
  )
}

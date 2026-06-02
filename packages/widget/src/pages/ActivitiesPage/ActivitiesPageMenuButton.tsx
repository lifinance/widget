import { useAccount } from '@lifi/wallet-management'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlined'
import { Button } from '@mui/material'
import { useMemo, useState } from 'react'
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
  const { accounts } = useAccount()
  const accountAddresses = useMemo(
    () => accounts.flatMap((account) => account.address ?? []),
    [accounts]
  )

  const handleDialogOpen = () => setDialogOpen(true)
  const handleDialogClose = () => setDialogOpen(false)

  const handleRemoveAllFailed = () => {
    deleteRoutes('failed', accountAddresses)
    handleDialogClose()
  }

  return (
    <>
      <ContextMenu
        buttonSx={{ position: 'static', marginRight: -1.5 }}
        items={[
          {
            icon: <DeleteOutlineIcon />,
            label: t('button.clearAllFailed'),
            onClick: handleDialogOpen,
          },
        ]}
      />
      <Dialog open={dialogOpen} onClose={handleDialogClose}>
        <DialogContainer>
          <DialogTitle>
            {t('warning.title.clearFailedTransactions')}
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              {t('warning.message.clearFailedTransactions')}
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

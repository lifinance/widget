import DeleteOutline from '@mui/icons-material/DeleteOutline'
import type { IconButtonProps } from '@mui/material'
import {
  Button,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  List,
  useTheme,
} from '@mui/material'
import { useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ActiveTransactionItem } from '../../components/ActiveTransactions/ActiveTransactionItem.js'
import { Dialog } from '../../components/Dialog.js'
import { PageContainer } from '../../components/PageContainer.js'
import { useHeader } from '../../hooks/useHeader.js'
import { useRouteExecutionStore } from '../../stores/routes/RouteExecutionStore.js'
import { useExecutingRoutesIds } from '../../stores/routes/useExecutingRoutesIds.js'
import { ActiveTransactionsEmpty } from './ActiveTransactionsEmpty.js'

const DeleteIconButton: React.FC<IconButtonProps> = ({ onClick }) => {
  const theme = useTheme()

  return (
    <IconButton
      size="medium"
      edge={theme?.navigation?.edge ? 'end' : false}
      onClick={onClick}
    >
      <DeleteOutline />
    </IconButton>
  )
}

export const ActiveTransactionsPage = () => {
  const { t } = useTranslation()
  const executingRoutes = useExecutingRoutesIds()
  const deleteRoutes = useRouteExecutionStore((store) => store.deleteRoutes)
  const [open, setOpen] = useState(false)

  const toggleDialog = useCallback(() => {
    setOpen((open) => !open)
  }, [])

  const headerAction = useMemo(
    () =>
      executingRoutes.length ? (
        <DeleteIconButton onClick={toggleDialog} />
      ) : undefined,
    [executingRoutes.length, toggleDialog]
  )

  useHeader(t('header.activeTransactions'), headerAction)

  if (!executingRoutes.length) {
    return <ActiveTransactionsEmpty />
  }

  return (
    <PageContainer disableGutters>
      <List
        className="long-list"
        sx={{
          paddingTop: 0,
          paddingLeft: 1.5,
          paddingRight: 1.5,
          paddingBottom: 1.5,
        }}
      >
        {executingRoutes.map((routeId) => (
          <ActiveTransactionItem key={routeId} routeId={routeId} />
        ))}
      </List>
      <Dialog open={open} onClose={toggleDialog}>
        <DialogTitle>{t('warning.title.deleteActiveTransactions')}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {t('warning.message.deleteActiveTransactions')}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={toggleDialog}>{t('button.cancel')}</Button>
          <Button
            variant="contained"
            onClick={() => deleteRoutes('active')}
            autoFocus
          >
            {t('button.delete')}
          </Button>
        </DialogActions>
      </Dialog>
    </PageContainer>
  )
}

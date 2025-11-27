import type { CardProps } from '@mui/material'
import { Stack } from '@mui/material'
import { useNavigate } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { useExecutingRoutesIds } from '../../stores/routes/useExecutingRoutesIds'
import { navigationRoutes } from '../../utils/navigationRoutes'
import { ButtonTertiary } from '../ButtonTertiary'
import { Card } from '../Card/Card'
import { CardTitle } from '../Card/CardTitle'
import { ActiveTransactionItem } from './ActiveTransactionItem'

export const ActiveTransactions: React.FC<CardProps> = (props) => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const executingRoutes = useExecutingRoutesIds()

  if (!executingRoutes?.length) {
    return null
  }

  const handleShowAll = () => {
    navigate({ to: navigationRoutes.activeTransactions })
  }

  const hasShowAll = executingRoutes?.length > 2

  return (
    <Card type="selected" selectionColor="secondary" {...props}>
      <CardTitle>{t('header.activeTransactions')}</CardTitle>
      <Stack spacing={1.5} sx={{ m: 2 }}>
        {executingRoutes.slice(0, 2).map((routeId) => (
          <ActiveTransactionItem key={routeId} routeId={routeId} dense />
        ))}
        {hasShowAll ? (
          <ButtonTertiary
            variant="text"
            onClick={handleShowAll}
            disableRipple
            fullWidth
          >
            {t('button.showAll')}
          </ButtonTertiary>
        ) : null}
      </Stack>
    </Card>
  )
}

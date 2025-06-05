import type { CardProps } from '@mui/material'
import { Stack } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { useExecutingRoutesIds } from '../../stores/routes/useExecutingRoutesIds.js'
import { navigationRoutes } from '../../utils/navigationRoutes.js'
import { ButtonTertiary } from '../ButtonTertiary.js'
import { Card } from '../Card/Card.js'
import { CardTitle } from '../Card/CardTitle.js'
import { ActiveTransactionItem } from './ActiveTransactionItem.js'

export const ActiveTransactions: React.FC<CardProps> = (props) => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const executingRoutes = useExecutingRoutesIds()

  if (!executingRoutes?.length) {
    return null
  }

  const handleShowAll = () => {
    navigate(navigationRoutes.activeTransactions)
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

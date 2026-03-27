import type { RouteExtended } from '@lifi/sdk'
import { useTranslation } from 'react-i18next'
import { Card } from '../../components/Card/Card.js'
import { CardTitle } from '../../components/Card/CardTitle.js'
import { StepActionsList } from './StepActionsList.js'

interface ReceiptsCardProps {
  route: RouteExtended
}

export const ReceiptsCard = ({ route }: ReceiptsCardProps) => {
  const { t } = useTranslation()
  const toAddress = route.toAddress

  return (
    <Card type="default" indented>
      <CardTitle sx={{ padding: 0, mb: 2 }}>{t('main.receipts')}</CardTitle>
      <StepActionsList route={route} toAddress={toAddress} />
    </Card>
  )
}

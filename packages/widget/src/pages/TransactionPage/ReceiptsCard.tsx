import type { RouteExtended } from '@lifi/sdk'
import { useTranslation } from 'react-i18next'
import { Card } from '../../components/Card/Card.js'
import { CardTitle } from '../../components/Card/CardTitle.js'
import { prepareActions } from '../../utils/prepareActions.js'
import { TransactionList } from './ReceiptsCard.style.js'
import { SentToWalletRow } from './SentToWalletRow.js'
import { StepActionRow } from './StepActionRow.js'

interface ReceiptsCardProps {
  route: RouteExtended
}

export const ReceiptsCard = ({ route }: ReceiptsCardProps) => {
  const { t } = useTranslation()
  const toAddress = route.toAddress

  return (
    <Card type="default" indented>
      <CardTitle sx={{ padding: 0, mb: 2 }}>{t('main.receipts')}</CardTitle>
      <TransactionList>
        {route.steps.map((step) => (
          <TransactionList key={step.id}>
            {prepareActions(step.execution?.actions ?? []).map(
              (actionsGroup, index) => (
                <StepActionRow
                  key={index}
                  step={step}
                  actionsGroup={actionsGroup}
                />
              )
            )}
          </TransactionList>
        ))}
        {toAddress ? (
          <SentToWalletRow toAddress={toAddress} toChainId={route.toChainId} />
        ) : undefined}
      </TransactionList>
    </Card>
  )
}

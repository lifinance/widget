import type { Route } from '@lifi/sdk'
import { Button } from '@mui/material'
import type { ForwardRefExoticComponent, RefAttributes, RefObject } from 'react'
import { forwardRef, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { BottomSheet } from '../../components/BottomSheet/BottomSheet.js'
import type { BottomSheetBase } from '../../components/BottomSheet/types.js'
import { FeeBreakdownTooltip } from '../../components/FeeBreakdownTooltip.js'
import { IconCircle } from '../../components/IconCircle/IconCircle.js'
import { useSetContentHeight } from '../../hooks/useSetContentHeight.js'
import { getAccumulatedFeeCostsBreakdown } from '../../utils/fees.js'
import {
  ButtonRow,
  CenterContainer,
  ContentContainer,
  DetailLabel,
  DetailRow,
  DetailValue,
  WarningMessage,
  WarningTitle,
} from './TokenValueBottomSheet.style.js'
import { calculateValueLossPercentage } from './utils.js'

interface TokenValueBottomSheetProps {
  route: Route
  onContinue(): void
  onCancel?(): void
}

export const TokenValueBottomSheet: ForwardRefExoticComponent<
  TokenValueBottomSheetProps & RefAttributes<BottomSheetBase>
> = forwardRef<BottomSheetBase, TokenValueBottomSheetProps>(
  ({ route, onContinue, onCancel }, ref) => {
    const handleCancel = () => {
      ;(ref as RefObject<BottomSheetBase>).current?.close()
      onCancel?.()
    }

    return (
      <BottomSheet ref={ref} onClose={onCancel}>
        <TokenValueBottomSheetContent
          route={route}
          onContinue={onContinue}
          onCancel={handleCancel}
        />
      </BottomSheet>
    )
  }
)

const TokenValueBottomSheetContent: React.FC<TokenValueBottomSheetProps> = ({
  route,
  onCancel,
  onContinue,
}) => {
  const { t } = useTranslation()
  const ref = useRef<HTMLElement>(null)
  useSetContentHeight(ref)
  const { gasCosts, feeCosts, gasCostUSD, feeCostUSD } =
    getAccumulatedFeeCostsBreakdown(route)
  const fromAmountUSD = Number.parseFloat(route.fromAmountUSD)
  const toAmountUSD = Number.parseFloat(route.toAmountUSD)

  return (
    <ContentContainer ref={ref}>
      <CenterContainer>
        <IconCircle status="warning" mb={1} />
        <WarningTitle>{t('warning.title.highValueLoss')}</WarningTitle>
      </CenterContainer>
      <WarningMessage>{t('warning.message.highValueLoss')}</WarningMessage>
      <DetailRow>
        <DetailLabel>{t('main.sending')}</DetailLabel>
        <DetailValue>
          {t('format.currency', { value: route.fromAmountUSD })}
        </DetailValue>
      </DetailRow>
      <DetailRow>
        <DetailLabel>{t('main.fees.network')}</DetailLabel>
        <FeeBreakdownTooltip gasCosts={gasCosts} gasless={!gasCostUSD}>
          <DetailValue>
            {!gasCostUSD
              ? t('main.fees.free')
              : t('format.currency', { value: gasCostUSD })}
          </DetailValue>
        </FeeBreakdownTooltip>
      </DetailRow>
      {feeCostUSD ? (
        <DetailRow>
          <DetailLabel>{t('main.fees.provider')}</DetailLabel>
          <FeeBreakdownTooltip feeCosts={feeCosts}>
            <DetailValue>
              {t('format.currency', { value: feeCostUSD })}
            </DetailValue>
          </FeeBreakdownTooltip>
        </DetailRow>
      ) : null}
      <DetailRow>
        <DetailLabel>{t('main.receiving')}</DetailLabel>
        <DetailValue>
          {t('format.currency', { value: route.toAmountUSD })}
        </DetailValue>
      </DetailRow>
      <DetailRow>
        <DetailLabel>{t('main.valueLoss')}</DetailLabel>
        <DetailValue>
          {calculateValueLossPercentage(
            fromAmountUSD,
            toAmountUSD,
            gasCostUSD,
            feeCostUSD
          )}
          %
        </DetailValue>
      </DetailRow>
      <ButtonRow>
        <Button variant="text" onClick={onCancel} fullWidth>
          {t('button.cancel')}
        </Button>
        <Button variant="contained" onClick={onContinue} fullWidth>
          {t('button.continue')}
        </Button>
      </ButtonRow>
    </ContentContainer>
  )
}

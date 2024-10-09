/* eslint-disable react/no-array-index-key */
import type { LiFiStepExtended, TokenAmount } from '@lifi/sdk'
import { Box } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { Card } from '../../components/Card/Card.js'
import { CardTitle } from '../../components/Card/CardTitle.js'
import { StepActions } from '../../components/StepActions/StepActions.js'
import { Token } from '../../components/Token/Token.js'
import { useExplorer } from '../../hooks/useExplorer.js'
import { useWidgetConfig } from '../../providers/WidgetProvider/WidgetProvider.js'
import { shortenAddress } from '../../utils/wallet.js'
import { DestinationWalletAddress } from './DestinationWalletAddress.js'
import { StepProcess } from './StepProcess.js'
import { StepTimer } from './StepTimer.js'

export const Step: React.FC<{
  step: LiFiStepExtended
  fromToken?: TokenAmount
  toToken?: TokenAmount
  impactToken?: TokenAmount
  toAddress?: string
}> = ({ step, fromToken, toToken, impactToken, toAddress }) => {
  const { t } = useTranslation()
  const { subvariant, subvariantOptions } = useWidgetConfig()
  const { getAddressLink } = useExplorer()
  const stepHasError = step.execution?.process.some(
    (process) => process.status === 'FAILED'
  )

  const getCardTitle = () => {
    switch (step.type) {
      case 'lifi': {
        const hasBridgeStep = step.includedSteps.some(
          (step) => step.type === 'cross'
        )
        const hasSwapStep = step.includedSteps.some(
          (step) => step.type === 'swap'
        )
        if (hasBridgeStep && hasSwapStep) {
          return subvariant === 'custom'
            ? subvariantOptions?.custom === 'deposit'
              ? t('main.stepBridgeAndDeposit')
              : t('main.stepBridgeAndBuy')
            : t('main.stepSwapAndBridge')
        }
        if (hasBridgeStep) {
          return subvariant === 'custom'
            ? subvariantOptions?.custom === 'deposit'
              ? t('main.stepBridgeAndDeposit')
              : t('main.stepBridgeAndBuy')
            : t('main.stepBridge')
        }
        return subvariant === 'custom'
          ? subvariantOptions?.custom === 'deposit'
            ? t('main.stepSwapAndDeposit')
            : t('main.stepSwapAndBuy')
          : t('main.stepSwap')
      }
      default:
        return subvariant === 'custom'
          ? subvariantOptions?.custom === 'deposit'
            ? t('main.stepSwapAndDeposit')
            : t('main.stepSwapAndBuy')
          : t('main.stepSwap')
    }
  }

  const formattedToAddress = shortenAddress(toAddress)
  const toAddressLink = toAddress
    ? getAddressLink(toAddress, step.action.toChainId)
    : undefined

  return (
    <Card type={stepHasError ? 'error' : 'default'}>
      <Box
        sx={{
          display: 'flex',
          flex: 1,
        }}
      >
        <CardTitle flex={1}>{getCardTitle()}</CardTitle>
        <CardTitle sx={{ fontWeight: 600 }}>
          <StepTimer step={step} />
        </CardTitle>
      </Box>
      <Box py={1}>
        {fromToken ? <Token token={fromToken} px={2} py={1} /> : null}
        <StepActions step={step} px={2} py={1} dense />
        {step.execution?.process.map((process, index) => (
          <StepProcess key={index} step={step} process={process} />
        ))}
        {formattedToAddress && toAddressLink ? (
          <DestinationWalletAddress
            step={step}
            toAddress={formattedToAddress}
            toAddressLink={toAddressLink}
          />
        ) : null}
        {toToken ? (
          <Token
            token={toToken}
            impactToken={impactToken}
            enableImpactTokenTooltip
            px={2}
            py={1}
          />
        ) : null}
      </Box>
    </Card>
  )
}

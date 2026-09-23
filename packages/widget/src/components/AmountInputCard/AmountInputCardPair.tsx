import type { BoxProps } from '@mui/material'
import type React from 'react'
import type { JSX } from 'react'
import { useWidgetConfig } from '../../providers/WidgetProvider/WidgetProvider.js'
import { useFieldValues } from '../../stores/form/useFieldValues.js'
import { isDestinationAllowedAsSource } from '../../utils/chainType.js'
import { LimitPriceCard } from '../LimitPriceCard/LimitPriceCard.js'
import { SwapButton } from '../SwapButton/SwapButton.js'
import { CardContainer } from './AmountInputCard.style.js'
import { ReceiveAmountCard } from './ReceiveAmountCard.js'
import { SendAmountCard } from './SendAmountCard.js'

export const AmountInputCardPair: React.FC<BoxProps> = (props): JSX.Element => {
  // Refuel's destination is fixed to native gas, so reversing from/to is
  // meaningless — hide the swap button (and the notch mask it sits in).
  const { mode, chains } = useWidgetConfig()
  const [toChainId] = useFieldValues('toChain')
  const showSwapButton =
    mode !== 'refuel' && isDestinationAllowedAsSource(toChainId, chains)

  return (
    <CardContainer {...props}>
      {mode === 'limit' ? <LimitPriceCard sx={{ marginBottom: 1 }} /> : null}
      <SendAmountCard mask={showSwapButton} />
      <SwapButton sx={{ visibility: showSwapButton ? 'visible' : 'hidden' }} />
      <ReceiveAmountCard mask={showSwapButton} />
    </CardContainer>
  )
}

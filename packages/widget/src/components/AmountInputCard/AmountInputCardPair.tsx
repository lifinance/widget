import type { BoxProps } from '@mui/material'
import type React from 'react'
import type { JSX } from 'react'
import { useWidgetConfig } from '../../providers/WidgetProvider/WidgetProvider.js'
import { SwapButton } from '../SwapButton/SwapButton.js'
import { CardContainer } from './AmountInputCard.style.js'
import { ReceiveAmountCard } from './ReceiveAmountCard.js'
import { SendAmountCard } from './SendAmountCard.js'

export const AmountInputCardPair: React.FC<BoxProps> = (props): JSX.Element => {
  // Refuel's destination is fixed to native gas, so reversing from/to is
  // meaningless — hide the swap button (and the notch mask it sits in).
  const { mode } = useWidgetConfig()
  const showSwapButton = mode !== 'refuel'

  return (
    <CardContainer {...props}>
      <SendAmountCard mask={showSwapButton} />
      <SwapButton sx={{ visibility: showSwapButton ? 'visible' : 'hidden' }} />
      <ReceiveAmountCard mask={showSwapButton} />
    </CardContainer>
  )
}

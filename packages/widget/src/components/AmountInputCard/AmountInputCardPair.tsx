import type { BoxProps } from '@mui/material'
import type React from 'react'
import type { JSX } from 'react'
import { useWidgetConfig } from '../../providers/WidgetProvider/WidgetProvider.js'
import { SwapButton } from '../SwapButton/SwapButton.js'
import { CardContainer } from './AmountInputCard.style.js'
import { ReceiveAmountCard } from './ReceiveAmountCard.js'
import { SendAmountCard } from './SendAmountCard.js'

export const AmountInputCardPair: React.FC<BoxProps> = (props): JSX.Element => {
  // The active navigation tab's mode is reflected in the widget config, so
  // refuel (which has no receive token) hides the swap button.
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

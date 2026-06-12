import type { BoxProps } from '@mui/material'
import type React from 'react'
import type { JSX } from 'react'
import { useHeaderTabsStore } from '../../stores/headerTabs/useHeaderTabsStore.js'
import { SwapButton } from '../SwapButton/SwapButton.js'
import { CardContainer } from './AmountInputCard.style.js'
import { ReceiveAmountCard } from './ReceiveAmountCard.js'
import { SendAmountCard } from './SendAmountCard.js'

export const AmountInputCardPair: React.FC<BoxProps> = (props): JSX.Element => {
  const activeTab = useHeaderTabsStore((state) => state.activeTab)
  const showSwapButton = activeTab?.mode !== 'refuel'

  return (
    <CardContainer {...props}>
      <SendAmountCard />
      <SwapButton sx={{ visibility: showSwapButton ? 'visible' : 'hidden' }} />
      <ReceiveAmountCard />
    </CardContainer>
  )
}

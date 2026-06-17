import type { BoxProps } from '@mui/material'
import type React from 'react'
import type { JSX } from 'react'
import { useJumperVariantStore } from '../../stores/jumperVariant/useJumperVariantStore.js'
import { getJumperTab } from '../../stores/jumperVariant/utils.js'
import { SwapButton } from '../SwapButton/SwapButton.js'
import { CardContainer } from './AmountInputCard.style.js'
import { ReceiveAmountCard } from './ReceiveAmountCard.js'
import { SendAmountCard } from './SendAmountCard.js'

export const AmountInputCardPair: React.FC<BoxProps> = (props): JSX.Element => {
  const tabKey = useJumperVariantStore((state) => state.state?.tabKey)
  const mode = tabKey ? getJumperTab(tabKey).mode : undefined
  const showSwapButton = mode !== 'refuel'

  return (
    <CardContainer {...props}>
      <SendAmountCard mask={showSwapButton} />
      <SwapButton sx={{ visibility: showSwapButton ? 'visible' : 'hidden' }} />
      <ReceiveAmountCard mask={showSwapButton} />
    </CardContainer>
  )
}

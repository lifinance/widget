import ArrowDownward from '@mui/icons-material/ArrowDownward'
import type { BoxProps } from '@mui/material'
import type { JSX } from 'react'
import { useAvailableChains } from '../../hooks/useAvailableChains.js'
import { useToAddressAutoPopulate } from '../../hooks/useToAddressAutoPopulate.js'
import { useToAddressReset } from '../../hooks/useToAddressReset.js'
import { useFieldActions } from '../../stores/form/useFieldActions.js'
import { SwapButtonContainer, SwapIconCard } from './SwapButton.style.js'

export const SwapButton: React.FC<BoxProps> = ({
  sx,
  ...props
}): JSX.Element => {
  const { setFieldValue, getFieldValues } = useFieldActions()
  const { getChainById } = useAvailableChains()
  const { tryResetToAddress } = useToAddressReset()
  const autoPopulateToAddress = useToAddressAutoPopulate()

  const handleClick = (): void => {
    const [fromChainId, fromToken, toChainId, toToken, toAddress] =
      getFieldValues(
        'fromChain',
        'fromToken',
        'toChain',
        'toToken',
        'toAddress'
      )
    setFieldValue('fromAmount', '', { isTouched: true })
    setFieldValue('fromChain', toChainId, { isTouched: true })
    setFieldValue('fromToken', toToken, { isTouched: true })
    setFieldValue('toChain', fromChainId, { isTouched: true })
    setFieldValue('toToken', fromToken, { isTouched: true })

    const autoPopulatedToAddress = autoPopulateToAddress({
      formType: 'from',
      selectedToAddress: toAddress,
      selectedChainId: toChainId,
      selectedOppositeChainId: fromChainId,
      selectedOppositeTokenAddress: fromToken,
    })

    if (autoPopulatedToAddress) {
      return
    }

    const toChain = getChainById(fromChainId)
    if (toChain) {
      tryResetToAddress(toChain)
    }
  }

  return (
    <SwapButtonContainer sx={sx} {...props}>
      <SwapIconCard component="button" onClick={handleClick}>
        <ArrowDownward fontSize="inherit" />
      </SwapIconCard>
    </SwapButtonContainer>
  )
}

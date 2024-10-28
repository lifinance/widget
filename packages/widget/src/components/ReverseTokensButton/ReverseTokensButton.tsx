import { ArrowDownward, ArrowForward } from '@mui/icons-material'
import { useAvailableChains } from '../../hooks/useAvailableChains.js'
import { useToAddressAutoPopulate } from '../../hooks/useToAddressAutoPopulate.js'
import { useToAddressReset } from '../../hooks/useToAddressReset.js'
import { useFieldActions } from '../../stores/form/useFieldActions.js'
import { IconCard, ReverseContainer } from './ReverseTokensButton.style.js'

export const ReverseTokensButton: React.FC<{ vertical?: boolean }> = ({
  vertical,
}) => {
  const { setFieldValue, getFieldValues } = useFieldActions()
  const { getChainById } = useAvailableChains()
  const { tryResetToAddress } = useToAddressReset()
  const autoPopulateToAddress = useToAddressAutoPopulate()

  const handleClick = () => {
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

    // Returning early as a compatible connected wallet was found, and toAddress has been populated
    if (autoPopulatedToAddress) {
      return
    }

    // Auto-population applies in certain scenarios, but otherwise,
    // we attempt to reset `toAddress` when bridging across ecosystems
    // fromChainId becomes toChainId after using reverse
    const toChain = getChainById(fromChainId)
    if (toChain) {
      tryResetToAddress(toChain)
    }
  }
  return (
    <ReverseContainer>
      <IconCard onClick={handleClick}>
        {vertical ? (
          <ArrowDownward fontSize="inherit" />
        ) : (
          <ArrowForward fontSize="inherit" />
        )}
      </IconCard>
    </ReverseContainer>
  )
}

import { useWidgetConfig } from '../../providers/WidgetProvider/WidgetProvider.js'
import { useChainOrderStore } from '../../stores/chains/ChainOrderStore.js'
import { useFieldValues } from '../../stores/form/useFieldValues.js'
import { DisabledUI, HiddenUI } from '../../types/widget.js'
import { SendToWalletButton } from './SendToWalletButton.js'

export const SendToWallet = () => {
  const { disabledUI, hiddenUI } = useWidgetConfig()
  const hiddenToAddress = hiddenUI?.includes(HiddenUI.ToAddress)
  const disabledToAddress = disabledUI?.includes(DisabledUI.ToAddress)
  const [toAddressValue, toChainId, toTokenAddress] = useFieldValues(
    'toAddress',
    'toChain',
    'toToken'
  )
  const isAllNetworks = useChainOrderStore((state) => state[`toIsAllNetworks`])

  const showWalletButton =
    !hiddenToAddress && !(disabledToAddress && !toAddressValue)

  const chaindId = toTokenAddress
    ? toChainId
    : isAllNetworks
      ? undefined
      : toChainId

  if (!showWalletButton || !chaindId) {
    return null
  }

  return <SendToWalletButton chainId={chaindId} readOnly={disabledToAddress} />
}

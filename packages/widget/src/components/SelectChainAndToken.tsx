import { Box } from '@mui/material'
import { ReverseTokensButton } from '../components/ReverseTokensButton/ReverseTokensButton.js'
import { SelectTokenButton } from '../components/SelectTokenButton/SelectTokenButton.js'
import { useWidgetConfig } from '../providers/WidgetProvider/WidgetProvider.js'
import { DisabledUI, HiddenUI } from '../types/widget.js'
import { ReverseTokensButtonEmpty } from './ReverseTokensButton/ReverseTokensButton.style.js'

export const SelectChainAndToken = () => {
  const { disabledUI, hiddenUI, subvariant } = useWidgetConfig()

  const hiddenReverse =
    subvariant === 'refuel' ||
    disabledUI?.includes(DisabledUI.FromToken) ||
    disabledUI?.includes(DisabledUI.ToToken) ||
    hiddenUI?.includes(HiddenUI.FromToken) ||
    hiddenUI?.includes(HiddenUI.ToToken) ||
    hiddenUI?.includes(HiddenUI.ReverseTokensButton)

  const hiddenFromToken = hiddenUI?.includes(HiddenUI.FromToken)
  const hiddenToToken =
    subvariant === 'custom' || hiddenUI?.includes(HiddenUI.ToToken)

  const showReverseButton = !hiddenToToken && !hiddenFromToken

  return (
    <Box sx={{ display: 'flex' }}>
      {!hiddenFromToken ? (
        <SelectTokenButton formType="from" hiddenReverse={hiddenReverse} />
      ) : null}
      {showReverseButton ? (
        !hiddenReverse ? (
          <ReverseTokensButton />
        ) : (
          <ReverseTokensButtonEmpty />
        )
      ) : null}
      {!hiddenToToken ? (
        <SelectTokenButton formType="to" hiddenReverse={hiddenReverse} />
      ) : null}
    </Box>
  )
}

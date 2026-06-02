import type { BoxProps } from '@mui/material'
import { Box } from '@mui/material'
import { ReverseTokensButton } from '../components/ReverseTokensButton/ReverseTokensButton.js'
import { SelectTokenButton } from '../components/SelectTokenButton/SelectTokenButton.js'
import { useWidgetConfig } from '../providers/WidgetProvider/WidgetProvider.js'
import { ReverseTokensButtonEmpty } from './ReverseTokensButton/ReverseTokensButton.style.js'

export const SelectChainAndToken: React.FC<BoxProps> = (props) => {
  const { disabledUI, hiddenUI, mode } = useWidgetConfig()

  const hiddenReverse =
    mode === 'refuel' ||
    disabledUI?.fromToken ||
    disabledUI?.toToken ||
    hiddenUI?.fromToken ||
    hiddenUI?.toToken ||
    hiddenUI?.reverseTokensButton

  const hiddenFromToken = hiddenUI?.fromToken
  const hiddenToToken = mode === 'custom' || hiddenUI?.toToken

  const showReverseButton = !hiddenToToken && !hiddenFromToken

  return (
    <Box {...props} sx={{ display: 'flex', ...props.sx }}>
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

import type { BoxProps, Theme } from '@mui/material'
import { Box, useMediaQuery } from '@mui/material'
import { ReverseTokensButton } from '../components/ReverseTokensButton/ReverseTokensButton.js'
import { SelectTokenButton } from '../components/SelectTokenButton/SelectTokenButton.js'
import { useWidgetConfig } from '../providers/WidgetProvider/WidgetProvider.js'
import { useFieldValues } from '../stores/form/useFieldValues.js'
import { DisabledUI, HiddenUI } from '../types/widget.js'
import { ReverseTokensButtonEmpty } from './ReverseTokensButton/ReverseTokensButton.style.js'

export const SelectChainAndToken: React.FC<BoxProps> = (props) => {
  const prefersNarrowView = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down('sm')
  )
  const { disabledUI, hiddenUI, subvariant, subvariantOptions } =
    useWidgetConfig()

  const [fromChain, toChain, fromToken, toToken] = useFieldValues(
    'fromChain',
    'toChain',
    'fromToken',
    'toToken'
  )

  const hiddenReverse =
    subvariant === 'refuel' ||
    disabledUI?.includes(DisabledUI.FromToken) ||
    disabledUI?.includes(DisabledUI.ToToken) ||
    hiddenUI?.includes(HiddenUI.FromToken) ||
    hiddenUI?.includes(HiddenUI.ToToken) ||
    hiddenUI?.includes(HiddenUI.ReverseTokensButton)

  const hiddenFromToken = hiddenUI?.includes(HiddenUI.FromToken)
  const hiddenToToken =
    (subvariant === 'custom' && subvariantOptions?.custom !== 'fund') ||
    hiddenUI?.includes(HiddenUI.ToToken)

  const isCompact =
    !!fromChain &&
    !!toChain &&
    !!fromToken &&
    !!toToken &&
    !prefersNarrowView &&
    !hiddenToToken &&
    !hiddenFromToken

  return (
    <Box
      sx={{ display: 'flex', flexDirection: isCompact ? 'row' : 'column' }}
      {...props}
    >
      {!hiddenFromToken ? (
        <SelectTokenButton
          formType="from"
          compact={isCompact}
          hiddenReverse={hiddenReverse}
        />
      ) : null}
      {!hiddenToToken && !hiddenFromToken ? (
        !hiddenReverse ? (
          <ReverseTokensButton vertical={!isCompact} />
        ) : (
          <ReverseTokensButtonEmpty />
        )
      ) : null}
      {!hiddenToToken ? (
        <SelectTokenButton
          formType="to"
          compact={isCompact}
          hiddenReverse={hiddenReverse}
        />
      ) : null}
    </Box>
  )
}

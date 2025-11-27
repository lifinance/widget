import type { BoxProps, Theme } from '@mui/material'
import { Box, useMediaQuery } from '@mui/material'
import { ReverseTokensButton } from '../components/ReverseTokensButton/ReverseTokensButton'
import { SelectTokenButton } from '../components/SelectTokenButton/SelectTokenButton'
import { useWidgetConfig } from '../providers/WidgetProvider/WidgetProvider'
import { useFieldValues } from '../stores/form/useFieldValues'
import { DisabledUI, HiddenUI } from '../types/widget'
import { ReverseTokensButtonEmpty } from './ReverseTokensButton/ReverseTokensButton.style'

export const SelectChainAndToken: React.FC<BoxProps> = (props) => {
  const prefersNarrowView = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down('sm')
  )
  const { disabledUI, hiddenUI, subvariant } = useWidgetConfig()

  const [fromChain, toChain, fromToken, toToken] = useFieldValues(
    'fromChain',
    'toChain',
    'fromToken',
    'toToken'
  )

  const hiddenFromToken = hiddenUI?.includes(HiddenUI.FromToken)

  const hiddenReverse =
    subvariant === 'refuel' ||
    disabledUI?.includes(DisabledUI.FromToken) ||
    disabledUI?.includes(DisabledUI.ToToken) ||
    hiddenUI?.includes(HiddenUI.FromToken) ||
    hiddenUI?.includes(HiddenUI.ToToken) ||
    hiddenUI?.includes(HiddenUI.ReverseTokensButton)

  const hiddenToToken =
    subvariant === 'custom' || hiddenUI?.includes(HiddenUI.ToToken)

  const isCompact =
    !!fromChain &&
    !!toChain &&
    !!fromToken &&
    !!toToken &&
    !prefersNarrowView &&
    !hiddenToToken

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

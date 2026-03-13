import type { RouteExtended, TokenAmount } from '@lifi/sdk'
import ExpandLess from '@mui/icons-material/ExpandLess'
import ExpandMore from '@mui/icons-material/ExpandMore'
import { Box, Collapse } from '@mui/material'
import { type MouseEventHandler, useState } from 'react'
import { useWidgetConfig } from '../../providers/WidgetProvider/WidgetProvider.js'
import { HiddenUI } from '../../types/widget.js'
import { CardIconButton } from '../Card/CardIconButton.js'
import { RouteDetails } from '../Step/RouteDetails.js'
import { Token } from '../Token/Token.js'
import { TokenContainer } from './RouteToken.style.js'

interface RouteTokenProps {
  route: RouteExtended
  token: TokenAmount
  impactToken?: TokenAmount
  defaultExpanded?: boolean
}

export const RouteToken = ({
  route,
  token,
  impactToken,
  defaultExpanded,
}: RouteTokenProps) => {
  const { hiddenUI } = useWidgetConfig()

  const [cardExpanded, setCardExpanded] = useState(defaultExpanded)

  const handleExpand: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.stopPropagation()
    setCardExpanded((expanded) => !expanded)
  }

  return (
    <Box>
      <TokenContainer>
        <Token
          token={token}
          impactToken={impactToken}
          step={route.steps[0]}
          stepVisible={!cardExpanded}
          disableDescription={hiddenUI?.includes(
            HiddenUI.RouteTokenDescription
          )}
        />
        {!defaultExpanded ? (
          <CardIconButton onClick={handleExpand} size="small">
            {cardExpanded ? (
              <ExpandLess fontSize="inherit" />
            ) : (
              <ExpandMore fontSize="inherit" />
            )}
          </CardIconButton>
        ) : null}
      </TokenContainer>
      <Collapse timeout={225} in={cardExpanded} mountOnEnter unmountOnExit>
        <RouteDetails route={route} />
      </Collapse>
    </Box>
  )
}

import type { RouteExtended, TokenAmount } from '@lifi/sdk'
import ExpandLess from '@mui/icons-material/ExpandLess'
import ExpandMore from '@mui/icons-material/ExpandMore'
import { Box, Collapse } from '@mui/material'
import type { JSX } from 'react'
import { type MouseEventHandler, useState } from 'react'
import { useWidgetConfig } from '../../providers/WidgetProvider/WidgetProvider.js'
import { CardIconButton } from '../Card/CardIconButton.js'
import { Token } from '../Token/Token.js'
import { RouteCardEssentials } from './RouteCardEssentials.js'
import { RouteDetails } from './RouteDetails.js'
import { TokenContainer } from './RouteToken.style.js'

interface RouteTokenProps {
  route: RouteExtended
  token: TokenAmount
  impactToken?: TokenAmount
  defaultExpanded?: boolean
  showEssentials?: boolean
  /** Id for the token row, so a control can take its name from it. */
  labelId?: string
}

export const RouteToken = ({
  route,
  token,
  impactToken,
  defaultExpanded,
  showEssentials,
  labelId,
}: RouteTokenProps): JSX.Element => {
  const { hiddenUI } = useWidgetConfig()

  const [cardExpanded, setCardExpanded] = useState(defaultExpanded)

  const handleExpand: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.stopPropagation()
    setCardExpanded((expanded) => !expanded)
  }

  return (
    <Box>
      <TokenContainer id={labelId}>
        <Token
          token={token}
          impactToken={impactToken}
          step={route.steps[0]}
          stepVisible={!cardExpanded}
          disableDescription={hiddenUI?.routeTokenDescription}
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
      {showEssentials ? (
        <Collapse timeout={225} in={!cardExpanded}>
          <RouteCardEssentials route={route} />
        </Collapse>
      ) : null}
    </Box>
  )
}

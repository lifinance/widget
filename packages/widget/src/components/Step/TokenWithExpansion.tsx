import type { RouteExtended, TokenAmount } from '@lifi/sdk'
import ExpandLess from '@mui/icons-material/ExpandLess'
import ExpandMore from '@mui/icons-material/ExpandMore'
import { Box, Collapse } from '@mui/material'
import { type MouseEventHandler, useState } from 'react'
import { useWidgetConfig } from '../../providers/WidgetProvider/WidgetProvider'
import { HiddenUI } from '../../types/widget'
import { CardIconButton } from '../Card/CardIconButton'
import { TokenContainer } from '../RouteCard/RouteCard.style'
import { Token } from '../Token/Token'
import { RouteDetails } from './RouteDetails'

interface TokenWithExpansionProps {
  route: RouteExtended
  token: TokenAmount
  impactToken?: TokenAmount
  defaultExpanded?: boolean
}

export const TokenWithExpansion = ({
  route,
  token,
  impactToken,
  defaultExpanded,
}: TokenWithExpansionProps) => {
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

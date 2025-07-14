import { AccordionDetails, Avatar, Box, Tooltip } from '@mui/material'
import type { NetworkAmount } from '../../types/token'
import { Accordion, AccordionSummary, AvatarGroup } from './TokenGroup.style'
import { TokenListItemButton } from './TokenListItemButton.js'
import { TokenListItemContent } from './TokenListItemContent'

interface TokenGroupProps {
  network: NetworkAmount
  onClick?(tokenAddress: string, chainId?: number): void
  isExpanded: boolean
  onExpand: (expanded: boolean) => void
  onShowTokenDetails: (tokenAddress: string, noContractAddress: boolean) => void
  showBalance: boolean
  isBalanceLoading?: boolean
}

export const TokenGroup = ({
  network,
  onClick,
  isExpanded,
  onExpand,
  onShowTokenDetails,
  showBalance,
}: TokenGroupProps) => {
  const handleChange = (_: React.SyntheticEvent, expanded: boolean) => {
    onExpand(expanded)
  }

  return (
    <Accordion expanded={isExpanded} disableGutters onChange={handleChange}>
      <AccordionSummary>
        <TokenListItemContent
          token={network}
          showBalance={false}
          isBalanceLoading={false}
          secondaryNode={
            <Box
              sx={{
                position: 'relative',
                height: 20,
              }}
            >
              <AvatarGroup spacing={6} max={15} total={network.chains?.length}>
                {network.chains?.map((chain) => (
                  <Tooltip
                    title={chain.name}
                    key={`${network.symbol}-${chain.id}`}
                  >
                    <Avatar
                      src={chain.logoURI}
                      alt={chain.name}
                      sx={{ width: 16, height: 16 }}
                    />
                  </Tooltip>
                ))}
              </AvatarGroup>
            </Box>
          }
        />
      </AccordionSummary>
      <AccordionDetails
        sx={{
          margin: 0,
          padding: 0,
        }}
      >
        <Box
          sx={{
            flexDirection: 'column',
            display: 'flex',
            justifyContent: 'center',
            width: '100%',
          }}
        >
          {network.tokens?.map((t, idx) => (
            <TokenListItemButton
              key={`${t.address}-${idx}`}
              token={t}
              chain={network.chains?.find((c) => c.id === t.chainId)}
              onClick={onClick}
              onShowTokenDetails={onShowTokenDetails}
              showBalance={showBalance}
            />
          ))}
        </Box>
      </AccordionDetails>
    </Accordion>
  )
}

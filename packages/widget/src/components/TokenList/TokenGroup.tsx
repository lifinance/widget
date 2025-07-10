import { AccordionDetails, Avatar, Box, Tooltip } from '@mui/material'
import AccordionSummary from '@mui/material/AccordionSummary'
import type { NetworkAmount, TokenAmount } from '../../types/token'
import { CustomAccordion, CustomAvatarGroup } from './TokenGroup.style'
import { TokenListItemButton } from './TokenListItemButton.js'
import { TokenListItemContent } from './TokenListItemContent'

interface TokenGroupProps {
  network: NetworkAmount
  onClick?(tokenAddress: string, chainId?: number): void
  isExpanded: boolean
  onExpand: (expanded: boolean) => void
  onShowTokenDetails: (tokenAddress: string, noContractAddress: boolean) => void
}

export const TokenGroup = ({
  network,
  onClick,
  isExpanded,
  onExpand,
  onShowTokenDetails,
}: TokenGroupProps) => {
  const handleChange = (_: React.SyntheticEvent, expanded: boolean) => {
    onExpand(expanded)
  }

  return (
    <CustomAccordion
      expanded={isExpanded}
      disableGutters
      onChange={handleChange}
    >
      <AccordionSummary
        sx={{
          padding: 0,
          '& .MuiAccordionSummary-content': {
            margin: 0,
            alignItems: 'center',
          },
        }}
        component={Box}
      >
        <TokenListItemContent
          token={network as TokenAmount}
          showBalance={false}
          isBalanceLoading={false}
          secondaryNode={
            <Box
              sx={{
                position: 'relative',
                height: 20,
              }}
            >
              <CustomAvatarGroup
                spacing={6}
                max={15}
                total={network.chains?.length}
              >
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
              </CustomAvatarGroup>
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
              onClick={() => {
                onClick?.(t.address, t.chainId)
              }}
              onShowTokenDetails={onShowTokenDetails}
            />
          ))}
        </Box>
      </AccordionDetails>
    </CustomAccordion>
  )
}

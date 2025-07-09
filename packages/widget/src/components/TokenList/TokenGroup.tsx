import {
  AccordionDetails,
  Avatar,
  Box,
  ListItemAvatar,
  ListItemText,
  Tooltip,
  // Typography,
} from '@mui/material'
import AccordionSummary from '@mui/material/AccordionSummary'
import { useState } from 'react'
// import { useTranslation } from 'react-i18next'
import type { NetworkAmount, TokenAmount } from '../../types/token'
import { CustomAccordion, CustomAvatarGroup } from './TokenGroup.style'
import {
  TokenListItemAvatar,
  TokenListItemButton,
} from './TokenListItemButton.js'

interface TokenGroupProps {
  network: NetworkAmount
  onClick?(tokenAddress: string, chainId?: number): void
}

export const TokenGroup = ({ network, onClick }: TokenGroupProps) => {
  // const { t } = useTranslation()
  const [isExpanded, setExpanded] = useState<boolean>(false)

  const handleChange = (_: React.SyntheticEvent, expanded: boolean) => {
    setExpanded(expanded)
  }

  return (
    <CustomAccordion
      expanded={isExpanded}
      disableGutters
      onChange={handleChange}
      sx={{
        //height: 60,
        marginBottom: '4px',
      }}
    >
      <AccordionSummary
        sx={{
          padding: 0,
          '& .MuiAccordionSummary-content': {
            margin: 0,
          },
        }}
      >
        <ListItemAvatar>
          <TokenListItemAvatar token={network as TokenAmount} />
        </ListItemAvatar>
        <ListItemText
          primary={network.symbol}
          slotProps={{
            secondary: {
              component: 'div',
            },
          }}
          secondary={
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
        {/* {accountAddress ? (
              isBalanceLoading ? (
                <TokenAmountSkeleton />
              ) : (
                <Box sx={{ textAlign: 'right' }}>
                  {token.amount ? (
                    <Typography
                      noWrap
                      sx={{
                        fontWeight: 600,
                      }}
                      title={tokenAmount}
                    >
                      {t('format.tokenAmount', {
                        value: tokenAmount,
                      })}
                    </Typography>
                  ) : null}
                  {tokenPrice ? (
                    <Typography
                      data-price={token.priceUSD}
                      sx={{
                        fontWeight: 500,
                        fontSize: 12,
                        color: 'text.secondary',
                      }}
                    >
                      {t('format.currency', {
                        value: tokenPrice,
                      })}
                    </Typography>
                  ) : null}
                </Box>
              )
            ) : null} */}
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
              onClick={() => {
                onClick?.(t.address, t.chainId)
              }}
            />
          ))}
        </Box>
      </AccordionDetails>
    </CustomAccordion>
  )
}

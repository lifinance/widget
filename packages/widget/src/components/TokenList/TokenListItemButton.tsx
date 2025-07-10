import { ChainType } from '@lifi/sdk'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import { Box, Slide } from '@mui/material'
import type { MouseEventHandler } from 'react'
import { useRef, useState } from 'react'
import { formatTokenAmount } from '../../utils/format'
import { formatTokenPrice } from '../../utils/format'
import { shortenAddress } from '../../utils/wallet'
import { ListItemButton } from '../ListItem/ListItemButton.js'
import { IconButton } from './TokenList.style.js'
import { TokenListItemContent } from './TokenListItemContent'
import type { TokenListItemButtonProps } from './types'

export const TokenListItemButton: React.FC<TokenListItemButtonProps> = ({
  onClick,
  token,
  chain,
  accountAddress,
  isBalanceLoading,
  selected,
  onShowTokenDetails,
}) => {
  const container = useRef(null)
  const timeoutId = useRef<ReturnType<typeof setTimeout>>(undefined)
  const [showAddress, setShowAddress] = useState(false)

  const withoutContractAddress = chain?.chainType === ChainType.UTXO

  const onMouseEnter = () => {
    timeoutId.current = setTimeout(() => {
      if (token.address) {
        setShowAddress(true)
      }
    }, 350)
  }

  const onMouseLeave = () => {
    clearTimeout(timeoutId.current)
    if (showAddress) {
      setShowAddress(false)
    }
  }

  const handleClick: MouseEventHandler<HTMLDivElement> = (e) => {
    e.stopPropagation()
    onClick?.(token.address, token.chainId)
  }

  const tokenAmount = formatTokenAmount(token.amount, token.decimals)
  const tokenPrice = formatTokenPrice(
    token.amount,
    token.priceUSD,
    token.decimals
  )

  return (
    <ListItemButton
      onClick={handleClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      dense
      selected={selected}
      sx={{
        height: 60,
        marginBottom: '4px',
      }}
    >
      <TokenListItemContent
        token={token}
        chain={chain}
        showBalance={!!accountAddress}
        isBalanceLoading={!!isBalanceLoading}
        tokenAmount={tokenAmount}
        tokenPrice={tokenPrice}
        secondaryNode={
          withoutContractAddress ? (
            <Box
              ref={container}
              sx={{
                height: 20,
                display: 'flex',
              }}
            >
              <Box
                sx={{
                  pt: 0.25,
                }}
              >
                {token.name}
              </Box>
              <Box
                sx={{
                  position: 'relative',
                }}
              >
                <Slide
                  direction="up"
                  in={showAddress}
                  container={container.current}
                  style={{
                    position: 'absolute',
                  }}
                  appear={false}
                  mountOnEnter
                >
                  <Box
                    sx={{
                      display: 'flex',
                    }}
                  >
                    <OpenTokenDetailsButton
                      tokenAddress={token.address}
                      withoutContractAddress={withoutContractAddress}
                      onClick={onShowTokenDetails}
                    />
                  </Box>
                </Slide>
              </Box>
            </Box>
          ) : (
            <Box
              ref={container}
              sx={{
                position: 'relative',
                height: 20,
              }}
            >
              <Slide
                direction="down"
                in={!showAddress}
                container={container.current}
                style={{
                  position: 'absolute',
                }}
                appear={false}
              >
                <Box
                  sx={{
                    pt: 0.25,
                  }}
                >
                  {token.name}
                </Box>
              </Slide>
              <Slide
                direction="up"
                in={showAddress}
                container={container.current}
                style={{
                  position: 'absolute',
                }}
                appear={false}
                mountOnEnter
              >
                <Box
                  sx={{
                    display: 'flex',
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      pt: 0.125,
                    }}
                  >
                    {shortenAddress(token.address)}
                  </Box>
                  <OpenTokenDetailsButton
                    tokenAddress={token.address}
                    withoutContractAddress={withoutContractAddress}
                    onClick={onShowTokenDetails}
                  />
                </Box>
              </Slide>
            </Box>
          )
        }
      />
    </ListItemButton>
  )
}

interface OpenTokenDetailsButtonProps {
  tokenAddress: string | undefined
  withoutContractAddress: boolean
  onClick: (tokenAddress: string, withoutContractAddress: boolean) => void
}

const OpenTokenDetailsButton = ({
  tokenAddress,
  withoutContractAddress,

  onClick,
}: OpenTokenDetailsButtonProps) => {
  if (!tokenAddress) {
    return null
  }
  return (
    <IconButton
      size="small"
      onClick={(e) => {
        e.stopPropagation()
        onClick(tokenAddress, withoutContractAddress)
      }}
    >
      <InfoOutlinedIcon />
    </IconButton>
  )
}

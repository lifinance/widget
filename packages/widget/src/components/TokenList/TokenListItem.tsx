import type { NetworkAmount, TokenAmount } from '../../types/token.js'
import { TokenGroup } from './TokenGroup.js'
import { ListItem } from './TokenList.style.js'
import { TokenListItemButton } from './TokenListItemButton.js'
import type { TokenListItemProps } from './types.js'

export const TokenListItem: React.FC<TokenListItemProps> = ({
  onClick,
  size,
  start,
  token,
  chain,
  accountAddress,
  isBalanceLoading,
  startAdornment,
  endAdornment,
  selectedTokenAddress,
  onShowTokenDetails,
}) => {
  const isNetwork = !('chainId' in token)
  return (
    <ListItem
      style={{
        height: `${size}px`,
        transform: `translateY(${start}px)`,
        padding: 0,
      }}
    >
      {startAdornment}
      {isNetwork ? (
        <TokenGroup network={token as NetworkAmount} onClick={onClick} />
      ) : (
        <TokenListItemButton
          token={token as TokenAmount}
          accountAddress={accountAddress}
          isBalanceLoading={isBalanceLoading}
          onClick={onClick}
          chain={chain}
          selected={token.address === selectedTokenAddress}
          onShowTokenDetails={onShowTokenDetails}
        />
      )}
      {endAdornment}
    </ListItem>
  )
}

import type { NetworkAmount, TokenAmount } from '../../types/token.js'
import { TokenGroup } from './TokenGroup.js'
import { ListItem } from './TokenList.style.js'
import { TokenListItemButton } from './TokenListItemButton.js'
import type { TokenListItemProps } from './types.js'

// Type guard to check if token is NetworkAmount
const isNetworkAmount = (
  token: TokenAmount | NetworkAmount
): token is NetworkAmount => {
  return (
    'chains' in token &&
    'tokens' in token &&
    Array.isArray(token.chains) &&
    Array.isArray(token.tokens)
  )
}

export const TokenListItem: React.FC<TokenListItemProps> = ({
  onClick,
  size,
  start,
  token,
  chain,
  showBalance,
  isBalanceLoading,
  startAdornment,
  endAdornment,
  selectedTokenAddress,
  onShowTokenDetails,
  isExpanded,
  onExpand,
}) => {
  const isNetwork = isNetworkAmount(token)
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
        <TokenGroup
          network={token as NetworkAmount}
          onClick={onClick}
          isExpanded={isExpanded}
          onExpand={onExpand}
          onShowTokenDetails={onShowTokenDetails}
          showBalance={showBalance}
          isBalanceLoading={isBalanceLoading}
        />
      ) : (
        <TokenListItemButton
          token={token as TokenAmount}
          showBalance={showBalance}
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

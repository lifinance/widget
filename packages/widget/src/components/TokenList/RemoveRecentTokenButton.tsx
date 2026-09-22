import CloseIcon from '@mui/icons-material/Close'
import { IconButton } from '@mui/material'
import type { JSX } from 'react'
import { useRecentTokensStore } from '../../stores/recentTokens/RecentTokensStore.js'

interface RemoveRecentTokenButtonProps {
  chainId: number
  tokenAddress: string
}

export const RemoveRecentTokenButton = ({
  chainId,
  tokenAddress,
}: RemoveRecentTokenButtonProps): JSX.Element => {
  // Selecting the action alone keeps this out of every store update.
  const removeRecentToken = useRecentTokensStore(
    (state) => state.removeRecentToken
  )

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    ;(e.currentTarget as HTMLElement).blur()
    removeRecentToken(chainId, tokenAddress)
  }

  return (
    <IconButton
      sx={{ width: 20, height: 20 }}
      size="small"
      onClick={handleClick}
    >
      <CloseIcon sx={{ fontSize: 12, color: 'text.secondary' }} />
    </IconButton>
  )
}

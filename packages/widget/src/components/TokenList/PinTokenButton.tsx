import PushPinIcon from '@mui/icons-material/PushPin'
import PushPinOutlinedIcon from '@mui/icons-material/PushPinOutlined'
import { IconButton } from '@mui/material'
import { usePinnedTokensStore } from '../../stores/pinnedTokens/PinnedTokensStore.js'

interface PinTokenButtonProps {
  chainId: number
  tokenAddress: string
}

export const PinTokenButton = ({
  chainId,
  tokenAddress,
}: PinTokenButtonProps) => {
  const { pinnedTokens, pinToken, unpinToken } = usePinnedTokensStore(
    (state) => ({
      pinnedTokens: state.pinnedTokens,
      pinToken: state.pinToken,
      unpinToken: state.unpinToken,
    })
  )

  const isPinned =
    pinnedTokens[chainId]?.includes(tokenAddress.toLowerCase()) ?? false

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    ;(e.currentTarget as HTMLElement).blur()
    if (isPinned) {
      unpinToken(chainId, tokenAddress)
    } else {
      pinToken(chainId, tokenAddress)
    }
  }

  const PinIcon = isPinned ? PushPinIcon : PushPinOutlinedIcon

  return (
    <IconButton
      sx={{ width: 20, height: 20 }}
      size="small"
      onClick={handleClick}
    >
      <PinIcon
        sx={{
          fontSize: 12,
          color: isPinned ? 'text.primary' : 'text.secondary',
        }}
      />
    </IconButton>
  )
}

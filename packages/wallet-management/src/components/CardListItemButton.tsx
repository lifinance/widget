import { Avatar, Card, ListItemAvatar } from '@mui/material'
import { useWalletTag } from '../hooks/useWalletTag.js'
import type { WalletTagType } from '../types/walletTagType.js'
import { ListItemButton } from './ListItemButton.js'
import { ListItemText } from './ListItemText.js'
import { WalletTag } from './WalletTag.js'

interface CardListItemButtonProps {
  onClick: () => void
  title: string
  icon: string
  tagType?: WalletTagType
}

export const CardListItemButton: React.FC<CardListItemButtonProps> = ({
  onClick,
  title,
  icon,
  tagType,
}) => {
  const { getTagLabel } = useWalletTag()
  return (
    <Card>
      <ListItemButton onClick={onClick}>
        <ListItemAvatar>
          <Avatar src={icon} alt={title}>
            {title[0]}
          </Avatar>
        </ListItemAvatar>
        <ListItemText primary={title} />
        {tagType && <WalletTag type={tagType} label={getTagLabel(tagType)} />}
      </ListItemButton>
    </Card>
  )
}

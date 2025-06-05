import { Avatar, Card, ListItemAvatar } from '@mui/material'
import { useTagLabelByType } from '../hooks/useTagLabelByType.js'
import type { WalletTagType } from '../utils/walletTags.js'
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
  const getLabelByType = useTagLabelByType()
  return (
    <Card>
      <ListItemButton onClick={onClick}>
        <ListItemAvatar>
          <Avatar src={icon} alt={title}>
            {title[0]}
          </Avatar>
        </ListItemAvatar>
        <ListItemText primary={title} />
        {tagType && (
          <WalletTag type={tagType} label={getLabelByType(tagType)} />
        )}
      </ListItemButton>
    </Card>
  )
}

import { Avatar, Card, ListItemAvatar } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { WalletTagType } from '../types/walletTagType.js'
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
  const { t } = useTranslation()

  const getTagLabel = (tagType: WalletTagType) => {
    switch (tagType) {
      case WalletTagType.Connected:
        return t('tags.connected')
      case WalletTagType.Multichain:
        return t('tags.multichain')
      case WalletTagType.Installed:
        return t('tags.installed')
      case WalletTagType.QrCode:
        return t('tags.qrCode')
      case WalletTagType.GetStarted:
        return t('tags.getStarted')
      default:
        return ''
    }
  }

  return (
    <Card
      sx={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        padding: 1.5,
      }}
      onClick={onClick}
    >
      <ListItemAvatar>
        <Avatar src={icon} alt={title}>
          {title[0]}
        </Avatar>
      </ListItemAvatar>
      <ListItemText primary={title} />
      {tagType && <WalletTag type={tagType} label={getTagLabel(tagType)} />}
    </Card>
  )
}

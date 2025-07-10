import { Box, ListItemAvatar, ListItemText, Skeleton } from '@mui/material'
import { ListItem } from './TokenList.style.js'

export const TokenListItemSkeleton = () => {
  return (
    <ListItem
      secondaryAction={<TokenAmountSkeleton />}
      disablePadding
      sx={{
        position: 'relative',
        flexDirection: 'row',
        alignItems: 'center',
        padding: 0,
      }}
    >
      <ListItemAvatar>
        <Skeleton
          variant="circular"
          width={40}
          height={40}
          sx={{ marginLeft: 1.5, marginRight: 2 }}
        />
      </ListItemAvatar>
      <ListItemText
        primary={<Skeleton variant="text" width={56} height={24} />}
        secondary={<Skeleton variant="text" width={96} height={16} />}
      />
    </ListItem>
  )
}

export const TokenAmountSkeleton: React.FC = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
      }}
    >
      <Skeleton variant="text" width={56} height={24} />
      <Skeleton variant="text" width={48} height={16} />
    </Box>
  )
}

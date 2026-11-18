import {
  ListItem as ListItemBase,
  listItemButtonClasses,
  listItemTextClasses,
  Avatar as MuiAvatar,
  List as MuiList,
  ListItemAvatar as MuiListItemAvatar,
  ListItemText as MuiListItemText,
  styled,
} from '@mui/material'
import type React from 'react'
import { CardLabel, CardLabelTypography } from '../Card/CardLabel.js'
import { ListItemButton as ListItemButtonBase } from '../ListItemButton.js'

export const Avatar: React.FC<
  React.ComponentProps<typeof MuiAvatar> &
    Partial<{
      size?: 'small' | 'medium'
    }>
> = styled(MuiAvatar)<{
  size?: 'small' | 'medium'
}>(({ size = 'medium' }) => ({
  width: size === 'small' ? 32 : 40,
  height: size === 'small' ? 32 : 40,
}))

export const ListItemAvatar: React.FC<
  React.ComponentProps<typeof MuiListItemAvatar> &
    Partial<{
      size?: 'small' | 'medium'
    }>
> = styled(MuiListItemAvatar)<{
  size?: 'small' | 'medium'
}>(({ size = 'medium' }) => ({
  minWidth: size === 'small' ? 44 : 56,
}))

export const ListItemText: React.FC<
  React.ComponentProps<typeof MuiListItemText> &
    Partial<{
      size?: 'small' | 'medium'
    }>
> = styled(MuiListItemText)<{
  size?: 'small' | 'medium'
}>(({ size = 'medium' }) => ({
  [`.${listItemTextClasses.primary}`]: {
    fontWeight: 500,
    fontSize: size === 'small' ? '1rem' : '1.125rem',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
  },
}))

const chainRowLabelHeight = 18

// A labeled chain row is this much taller. The extra space holds the label and a
// 4px gap above the chain logo.
export const chainRowLabelOffset: number = chainRowLabelHeight + 4

export const ListItemButton: React.FC<
  React.ComponentProps<typeof ListItemButtonBase> &
    Partial<{
      size?: 'small' | 'medium'
      labeled?: boolean
    }>
> = styled(ListItemButtonBase, {
  shouldForwardProp: (prop) => prop !== 'labeled',
})<{
  size?: 'small' | 'medium'
  labeled?: boolean
}>(({ size = 'medium', labeled, theme }) => {
  return {
    borderRadius: theme.vars.shape.borderRadius,
    paddingLeft: size === 'small' ? theme.spacing(1) : theme.spacing(1.5),
    height: (size === 'small' ? 44 : 56) + (labeled ? chainRowLabelOffset : 0),
    // The default 8px top padding, plus the space for the label.
    paddingTop: labeled ? 8 + chainRowLabelOffset : undefined,
    width: '100%',
  }
})

export const List: React.FC<React.ComponentProps<typeof MuiList>> = styled(
  MuiList
)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(0.5),
  padding: 0,
  marginLeft: theme.spacing(1.5),
  marginRight: theme.spacing(1.5),
  marginBottom: theme.spacing(1.5),
  cursor: 'pointer',
}))

export const ListItem: React.FC<React.ComponentProps<typeof ListItemBase>> =
  styled(ListItemBase)(({ theme }) => ({
    position: 'absolute',
    top: 0,
    left: 0,
    [`& .${listItemButtonClasses.root}`]: {
      paddingRight: theme.spacing(1),
    },
  }))

export const ChainRowLabel: React.FC<React.ComponentProps<typeof CardLabel>> =
  styled(CardLabel)({
    height: chainRowLabelHeight,
    minWidth: 0,
    maxWidth: '100%',
  })

export const ChainRowLabelText: React.FC<
  React.ComponentProps<typeof CardLabelTypography>
> = styled(CardLabelTypography)(({ theme }) => ({
  // The extra bottom pixel centers the capital letters in the chip.
  padding: theme.spacing(0, 1, '1px'),
  fontSize: 10,
}))

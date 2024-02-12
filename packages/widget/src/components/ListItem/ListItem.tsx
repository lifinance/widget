import {
  ListItem as MuiListItem,
  listItemSecondaryActionClasses,
  listItemTextClasses,
  styled,
} from '@mui/material';

export const ListItem = styled(MuiListItem)(({ theme }) => ({
  height: 64,
  flexDirection: 'column',
  alignItems: 'flex-start',
  padding: theme.spacing(0, 1.5),
  [`.${listItemSecondaryActionClasses.root}`]: {
    right: theme.spacing(3),
  },
  [`& .${listItemTextClasses.secondary}`]: {
    fontSize: 12,
    fontWeight: 500,
  },
  [`& .${listItemTextClasses.primary}, & .${listItemTextClasses.secondary}`]: {
    lineHeight: 1.3334,
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
  },
}));

import {
  Box,
  IconButton,
  ListItem as MuiListItem,
  Menu,
  menuClasses,
  menuItemClasses,
  styled,
  svgIconClasses,
} from '@mui/material';
import { listItemTextClasses } from '@mui/material/ListItemText';

export const ListItemContainer = styled(MuiListItem)(({ theme }) => ({
  position: 'relative',
  padding: 0,
  height: 64,
  [`& .${listItemTextClasses.primary}`]: {
    fontSize: 18,
    fontWeight: 500,
    lineHeight: 1.5,
  },
  [`& .${listItemTextClasses.secondary}`]: {
    fontSize: 12,
    fontWeight: 500,
  },
  [`.${listItemTextClasses.primary} + .${listItemTextClasses.secondary}`]: {
    marginTop: theme.spacing(0.25),
  },
}));

export const ListItemInfoContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  margin: 0,
  justifyContent: 'flex-start',
  alignItems: 'center',
  gap: theme.spacing(1.5),
}));
export const ListItemMenuButton = styled(IconButton)(({ theme }) => ({
  position: 'absolute',
  right: theme.spacing(2),
  '&:hover, &:focus': {
    background:
      theme.palette.mode === 'light'
        ? theme.palette.grey[200]
        : theme.palette.grey[800],
  },
}));

export const ListMenu = styled(Menu)(({ theme }) => ({
  [`& .${menuClasses.paper}`]: {
    borderRadius: theme.shape.borderRadius,
    boxShadow: '0px 2px 4px rgb(0 0 0 / 8%), 0px 8px 16px rgb(0 0 0 / 8%)',
    padding: theme.spacing(2),
    [`& .${menuClasses.list}`]: {
      padding: 0,
    },
    [`& .${menuItemClasses.root}`]: {
      borderRadius: theme.shape.borderRadiusSecondary,
      padding: theme.spacing(1, 2, 1, 1),
      [`& .${svgIconClasses.root}`]: {
        fontSize: 20,
        color: theme.palette.text.primary,
        marginRight: theme.spacing(1.5),
      },
    },
  },
}));

import type { StyledComponent } from '@emotion/styled';
import type { ButtonProps, LinkProps } from '@mui/material';
import { Button, ListItem as MuiListItem, buttonClasses } from '@mui/material';
import { listItemSecondaryActionClasses } from '@mui/material/ListItemSecondaryAction';
import { listItemTextClasses } from '@mui/material/ListItemText';
import { alpha, styled } from '@mui/material/styles';
import { ListItemButton as ListItemButtonBase } from '../ListItemButton';

export const ListItemButton = styled(ListItemButtonBase)(({ theme }) => ({
  paddingLeft: theme.spacing(1.5),
  paddingRight: theme.spacing(1.5),
  height: 64,
  width: '100%',
}));

export const ListItem = styled(MuiListItem)(({ theme }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  height: 64,
  flexDirection: 'column',
  alignItems: 'flex-start',
  padding: theme.spacing(0, 1.5),
  [`.${listItemSecondaryActionClasses.root}`]: {
    right: theme.spacing(3),
  },
  [`& .${listItemTextClasses.primary}, & .${listItemTextClasses.secondary}`]: {
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
  },
}));

export const LinkButton: StyledComponent<ButtonProps & LinkProps> = styled(
  Button,
)<ButtonProps & LinkProps>(({ theme }) => ({
  lineHeight: 1,
  fontSize: '0.75rem',
  fontWeight: 400,
  padding: theme.spacing(0.375, 0.75),
  color: 'inherit',
  backgroundColor: 'unset',
  '&:hover': {
    backgroundColor:
      theme.palette.mode === 'light'
        ? alpha(theme.palette.common.black, 0.04)
        : alpha(theme.palette.common.white, 0.08),
  },
  [`.${buttonClasses.endIcon}`]: {
    marginLeft: theme.spacing(0.25),
  },
  [`.${buttonClasses.endIcon} > *:nth-of-type(1)`]: {
    fontSize: '0.75rem',
  },
}));

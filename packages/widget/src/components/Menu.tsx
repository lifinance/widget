import { Menu as MuiMenu } from '@mui/material';
import { menuClasses } from '@mui/material/Menu';
import { menuItemClasses } from '@mui/material/MenuItem';
import { styled } from '@mui/material/styles';
import { svgIconClasses } from '@mui/material/SvgIcon';

export const Menu = styled(MuiMenu)(({ theme }) => ({
  [`& .${menuClasses.paper}`]: {
    borderRadius: theme.shape.borderRadius,
    color: theme.palette.text.primary,
    [`& .${menuClasses.list}`]: {
      padding: theme.spacing(0.5, 0),
    },
    [`& .${menuItemClasses.root}`]: {
      [`& .${svgIconClasses.root}`]: {
        fontSize: 18,
        color: theme.palette.text.primary,
        marginRight: theme.spacing(1.5),
      },
    },
  },
}));

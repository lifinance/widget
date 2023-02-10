import { Menu as MuiMenu } from '@mui/material';
import { menuClasses } from '@mui/material/Menu';
import { menuItemClasses } from '@mui/material/MenuItem';
import { styled } from '@mui/material/styles';
import { svgIconClasses } from '@mui/material/SvgIcon';

export const WalletMenu = styled(MuiMenu)(({ theme }) => ({
  [`& .${menuClasses.paper}`]: {
    borderRadius: theme.shape.borderRadius,
    color: theme.palette.text.primary,
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

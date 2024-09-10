import {
  Menu as MuiMenu,
  menuClasses,
  menuItemClasses,
  styled,
  svgIconClasses,
} from '@mui/material';

export const Menu = styled(MuiMenu)(({ theme }) => ({
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

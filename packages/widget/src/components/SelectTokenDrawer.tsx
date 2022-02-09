import { Search as SearchIcon } from '@mui/icons-material';
import {
  Avatar,
  Box,
  Divider,
  Drawer,
  DrawerProps,
  FormControl,
  InputAdornment,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Select as MuiSelect,
  Typography,
} from '@mui/material';
import { inputBaseClasses } from '@mui/material/InputBase';
import { listItemIconClasses } from '@mui/material/ListItemIcon';
import { outlinedInputClasses } from '@mui/material/OutlinedInput';
import { styled } from '@mui/material/styles';
import {
  forwardRef,
  RefObject,
  useCallback,
  useEffect,
  useImperativeHandle,
  useState,
} from 'react';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useMatch, useNavigate } from 'react-router-dom';
import { useWidget } from '../providers/WidgetProvider';
import { routes } from '../utils/routes';
import { Input } from './Input';
import { Select } from './Select';

export type SelectTokenDrawerProps = DrawerProps & {
  tokens?: string[];
  containerRef: RefObject<Element>;
};

export interface SelectTokenDrawerBase {
  openDrawer(): void;
  closeDrawer(): void;
}

const TokenListItemButton = styled(ListItemButton)({
  borderRadius: '8px',
  '&:hover': {
    backgroundColor: 'rgba(0, 0, 0, 0.02)',
  },
});

export const TokenFilterSelect = styled(MuiSelect)(({ theme }) => ({
  backgroundColor:
    theme.palette.mode === 'light'
      ? theme.palette.grey[100]
      : theme.palette.grey[900],
  borderRadius: 8,
  border: 'none',
  '&:focus': {
    outline: 'none',
  },
  [`& .${inputBaseClasses.input}`]: {
    padding: '4px 12px',
    display: 'flex',
    alignItems: 'center',
  },
  [`& .${listItemIconClasses.root}`]: {
    minWidth: 38,
  },
  [`& .${outlinedInputClasses.notchedOutline}`]: {
    display: 'none',
  },
}));

export const SelectTokenDrawer = forwardRef<
  SelectTokenDrawerBase,
  SelectTokenDrawerProps
>(({ tokens, containerRef }, ref) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const homeMatch = useMatch(routes.home);
  const { register } = useFormContext();
  const { supportedChains } = useWidget();

  const openDrawer = useCallback(() => {
    navigate(routes.selectToken, { replace: true });
    setOpen(true);
  }, [navigate]);

  const closeDrawer = useCallback(() => {
    setOpen(false);
    navigate(routes.home, { replace: true });
  }, [navigate]);

  useImperativeHandle(
    ref,
    () => ({
      openDrawer,
      closeDrawer,
    }),
    [closeDrawer, openDrawer],
  );

  useEffect(() => {
    if (homeMatch && open) {
      setOpen(false);
    }
  }, [homeMatch, open]);

  return (
    <Drawer
      container={containerRef.current}
      anchor="right"
      open={open}
      onClose={closeDrawer}
      ModalProps={{
        sx: { position: 'absolute' },
        // keepMounted: true,
      }}
      PaperProps={{
        sx: {
          position: 'absolute',
          width: '85%',
        },
      }}
      BackdropProps={{
        sx: {
          position: 'absolute',
          backgroundColor: 'rgba(0,0,0,0.12)',
          backdropFilter: 'blur(3px)',
        },
      }}
      SlideProps={{ container: containerRef.current }}
    >
      <Box role="presentation">
        <Box m={3}>
          <FormControl variant="standard" fullWidth>
            <Input
              size="small"
              placeholder={t(`swap.tokenSearch`)}
              endAdornment={
                <InputAdornment position="end">
                  <SearchIcon />
                </InputAdornment>
              }
            />
          </FormControl>
        </Box>
        <Divider light />
        <Box mt={3} mx={3}>
          <Typography
            variant="subtitle1"
            noWrap
            sx={{ fontWeight: 500 }}
            mb={1}
          >
            {t(`swap.selectChain`)}
          </Typography>
          <FormControl fullWidth>
            <Select
              defaultValue="eth"
              inputProps={{
                'aria-label': '',
              }}
              MenuProps={{ elevation: 2 }}
            >
              {supportedChains.map((chain) => (
                <MenuItem key={chain.key} value={chain.key}>
                  <ListItemIcon>
                    <Avatar
                      src={chain.logoURI}
                      alt={chain.key}
                      sx={{ width: 24, height: 24 }}
                    >
                      {chain.name[0]}
                    </Avatar>
                  </ListItemIcon>
                  {chain.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Box
            mt={3}
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Typography variant="subtitle1" noWrap sx={{ fontWeight: 500 }}>
              {t(`swap.selectToken`)}
            </Typography>
            <FormControl>
              <TokenFilterSelect
                defaultValue={0}
                inputProps={{
                  'aria-label': '',
                }}
                MenuProps={{ elevation: 2, MenuListProps: { dense: true } }}
              >
                <MenuItem value={0}>{t(`swap.myTokens`)}</MenuItem>
                <MenuItem value={1}>{t(`swap.allTokens`)}</MenuItem>
              </TokenFilterSelect>
            </FormControl>
          </Box>
        </Box>
        <List sx={{ padding: '8px' }}>
          {[1, 2, 3].map((index) => (
            <ListItem
              key={index}
              secondaryAction={
                <Typography variant="body1" noWrap>
                  0.99999991
                </Typography>
              }
              disablePadding
            >
              <TokenListItemButton dense onClick={closeDrawer}>
                <ListItemAvatar>
                  <Avatar
                    alt="Ethereum"
                    src="https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/logo.png"
                  />
                </ListItemAvatar>
                <ListItemText primary="AAVE" secondary="Aave" />
              </TokenListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>
    </Drawer>
  );
});

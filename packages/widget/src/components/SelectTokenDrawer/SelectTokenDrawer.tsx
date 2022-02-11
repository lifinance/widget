import { Search as SearchIcon } from '@mui/icons-material';
import {
  Avatar,
  Box,
  Divider,
  Drawer,
  FormControl,
  InputAdornment,
  ListItemIcon,
  MenuItem,
  Typography,
} from '@mui/material';
import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useState,
} from 'react';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useResizeDetector } from 'react-resize-detector';
import { useMatch, useNavigate } from 'react-router-dom';
import { useWidgetConfig } from '../../providers/WidgetProvider';
import { routes } from '../../utils/routes';
import { Input } from '../Input';
import { Select } from '../Select';
import { TokenList } from '../TokenList';
import { TokenFilterSelect } from './SelectTokenDrawer.style';
import { SelectTokenDrawerBase, SelectTokenDrawerProps } from './types';

export const SelectTokenDrawer = forwardRef<
  SelectTokenDrawerBase,
  SelectTokenDrawerProps
>(({ containerRef, formType }, ref) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const homeMatch = useMatch(routes.home);
  const [open, setOpen] = useState(false);
  const { register } = useFormContext();
  const { supportedChains, fromChain, toChain } = useWidgetConfig();

  const defaultChainValue = formType === 'from' ? fromChain : toChain;
  const selectChainFormName = `${formType}Chain`;

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

  const { height: drawerHeight, ref: drawerRef } =
    useResizeDetector<HTMLDivElement | null>();
  const { height: drawerHeaderHeight, ref: drawerHeaderRef } =
    useResizeDetector<HTMLDivElement | null>();

  const availableTokenListHeight =
    drawerHeight && drawerHeaderHeight ? drawerHeight - drawerHeaderHeight : 0;

  return (
    <Drawer
      container={containerRef.current}
      ref={drawerRef}
      anchor="right"
      open={open}
      onClose={closeDrawer}
      ModalProps={{
        sx: { position: 'absolute' },
        disablePortal: true,
        keepMounted: true,
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
        <Box ref={drawerHeaderRef}>
          <Box p={3}>
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
                defaultValue={defaultChainValue ?? 'eth'}
                inputProps={{
                  'aria-label': '',
                  ...register(selectChainFormName),
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
        </Box>
        <TokenList
          height={availableTokenListHeight}
          onClick={closeDrawer}
          chainFormName={selectChainFormName}
        />
      </Box>
    </Drawer>
  );
});

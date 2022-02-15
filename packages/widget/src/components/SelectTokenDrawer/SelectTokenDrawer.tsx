import {
  Box,
  Divider,
  Drawer,
  FormControl,
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
import {
  SwapFormDirection,
  SwapFormKey,
} from '../../providers/SwapFormProvider';
import { routes } from '../../utils/routes';
import { TokenList } from '../TokenList';
import { ChainSelect } from './ChainSelect';
import { SearchTokenInput } from './SearchTokenInput';
import { TokenFilterSelect } from './SelectTokenDrawer.style';
import {
  SelectTokenDrawerBase,
  SelectTokenDrawerProps,
  TokenFilterType,
} from './types';

export const SelectTokenDrawer = forwardRef<
  SelectTokenDrawerBase,
  SelectTokenDrawerProps
>(({ containerRef }, ref) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const homeMatch = useMatch(routes.home);
  const [open, setOpen] = useState(false);
  const [formType, setFormType] = useState<SwapFormDirection>('from');
  const { register } = useFormContext();

  const openDrawer = useCallback(
    (type) => {
      navigate(routes.selectToken, { replace: true });
      setFormType(type);
      setOpen(true);
    },
    [navigate],
  );

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
        <TokenList
          height={drawerHeight ?? 0}
          headerHeight={drawerHeaderHeight ?? 0}
          onClick={closeDrawer}
          formType={formType}
        >
          <Box ref={drawerHeaderRef}>
            <Box p={3}>
              <SearchTokenInput formType={formType} />
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
              <ChainSelect formType={formType} />
              <Box
                mt={3}
                pb={1}
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
                    defaultValue={TokenFilterType.My}
                    MenuProps={{ elevation: 2, MenuListProps: { dense: true } }}
                    inputProps={{
                      ...register(SwapFormKey.MyTokensFilter),
                    }}
                  >
                    <MenuItem value={TokenFilterType.My}>
                      {t(`swap.myTokens`)}
                    </MenuItem>
                    <MenuItem value={TokenFilterType.All}>
                      {t(`swap.allTokens`)}
                    </MenuItem>
                  </TokenFilterSelect>
                </FormControl>
              </Box>
            </Box>
          </Box>
        </TokenList>
      </Box>
    </Drawer>
  );
});

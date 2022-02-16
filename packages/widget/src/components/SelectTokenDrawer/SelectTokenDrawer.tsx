import {
  Box,
  Divider,
  DrawerProps,
  FormControl,
  MenuItem,
  Typography,
} from '@mui/material';
import { forwardRef, MutableRefObject, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useResizeDetector } from 'react-resize-detector';
import {
  SwapFormDirection,
  SwapFormKey,
} from '../../providers/SwapFormProvider';
import { ContainerDrawer } from '../ContainerDrawer';
import { TokenList } from '../TokenList';
import { ChainSelect } from './ChainSelect';
import { SearchTokenInput } from './SearchTokenInput';
import { TokenFilterSelect } from './SelectTokenDrawer.style';
import { SelectTokenDrawerBase, TokenFilterType } from './types';

export const SelectTokenDrawer = forwardRef<SelectTokenDrawerBase, DrawerProps>(
  (_, ref) => {
    const { t } = useTranslation();
    const [formType, setFormType] = useState<SwapFormDirection>('from');
    const { register } = useFormContext();

    const { height: drawerHeight, ref: drawerRef } =
      useResizeDetector<HTMLDivElement | null>();
    const { height: drawerHeaderHeight, ref: drawerHeaderRef } =
      useResizeDetector<HTMLDivElement | null>();

    const closeDrawer = (ref as MutableRefObject<SelectTokenDrawerBase | null>)
      .current?.closeDrawer;

    return (
      <ContainerDrawer
        elementRef={drawerRef}
        ref={ref}
        onOpen={setFormType}
        route="selectToken"
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
                  <Typography
                    variant="subtitle1"
                    noWrap
                    sx={{ fontWeight: 500 }}
                  >
                    {t(`swap.selectToken`)}
                  </Typography>
                  <FormControl>
                    <TokenFilterSelect
                      defaultValue={TokenFilterType.My}
                      MenuProps={{
                        elevation: 2,
                        MenuListProps: { dense: true },
                      }}
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
      </ContainerDrawer>
    );
  },
);

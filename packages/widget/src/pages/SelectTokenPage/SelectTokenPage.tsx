import {
  Box,
  Container,
  Divider,
  FormControl,
  MenuItem,
  Typography,
} from '@mui/material';
import { FC, useLayoutEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { TokenList } from '../../components/TokenList';
import { useContentHeight } from '../../hooks';
import {
  SwapFormDirection,
  SwapFormKey,
} from '../../providers/SwapFormProvider';
import { ElementId } from '../../utils/elements';
import { ChainSelect } from './ChainSelect';
import { SearchTokenInput } from './SearchTokenInput';
import { TokenFilterSelect } from './SelectTokenPage.style';
import { TokenFilterType } from './types';

export const SelectTokenPage: FC<{ formType: SwapFormDirection }> = ({
  formType,
}) => {
  const { t } = useTranslation();
  const { register } = useFormContext();
  const navigate = useNavigate();
  const contentHeight = useContentHeight();

  const handleTokenClick = () => {
    navigate(-1);
  };

  useLayoutEffect(() => {
    const element = document.getElementById(ElementId.ScrollableContainer);
    if (element) {
      element.style.overflowY = 'hidden';
    }
    return () => {
      if (element) {
        element.style.overflowY = 'scroll';
      }
    };
  }, []);

  return (
    <Container disableGutters>
      <Box role="presentation">
        <TokenList
          height={contentHeight}
          headerHeight={261}
          onClick={handleTokenClick}
          formType={formType}
        >
          <Box>
            <Box p={3}>
              <SearchTokenInput formType={formType} />
            </Box>
            <Divider light />
            <Box mt={3} mx={3}>
              <Typography variant="subtitle1" noWrap fontWeight="500" mb={1}>
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
                <Typography variant="subtitle1" fontWeight="500" noWrap>
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
    </Container>
  );
};

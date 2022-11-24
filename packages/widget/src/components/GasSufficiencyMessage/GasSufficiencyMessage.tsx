import type { Route } from '@lifi/sdk';
import { WarningAmberRounded as WarningIcon } from '@mui/icons-material';
import type { BoxProps } from '@mui/material';
import { Box, Collapse, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useGasSufficiency } from '../../hooks';
import { useRecommendedRouteStore } from '../../stores';
import { CardTitle } from '../Card';
import { MessageCard } from './GasSufficiencyMessage.style';

export const GasSufficiencyMessage: React.FC<{ route?: Route } & BoxProps> = ({
  route,
  ...props
}) => {
  const { t } = useTranslation();
  const recommendedRoute = useRecommendedRouteStore(
    (state) => state.recommendedRoute,
  );
  const { insufficientFunds, insufficientGas } = useGasSufficiency(
    route ?? recommendedRoute,
  );

  return (
    <Collapse
      timeout={225}
      in={Boolean(insufficientFunds || insufficientGas?.length)}
      unmountOnExit
      mountOnEnter
      appear
    >
      <Box {...props}>
        <MessageCard>
          <WarningIcon
            sx={{
              marginTop: 2,
              marginLeft: 2,
            }}
          />
          <Box>
            {insufficientGas?.length ? (
              <CardTitle>{t(`swap.warning.title.insufficientGas`)}</CardTitle>
            ) : null}
            {insufficientFunds ? (
              <Typography
                variant="body2"
                px={2}
                pb={insufficientGas?.length ? 0 : 2}
                pt={insufficientGas?.length ? 1 : 2}
              >
                {insufficientFunds
                  ? t(`swap.warning.message.insufficientFunds`)
                  : null}
              </Typography>
            ) : null}
            {insufficientGas?.length ? (
              <Typography variant="body2" px={2} pt={1}>
                {t(`swap.warning.message.insufficientGas`)}
              </Typography>
            ) : null}
            {insufficientGas?.length
              ? insufficientGas.map((item, index) => (
                  <Typography
                    // eslint-disable-next-line react/no-array-index-key
                    key={index}
                    variant="body2"
                    px={2}
                    pb={insufficientGas.length - 1 === index ? 2 : 0}
                    pt={0.5}
                  >
                    {t(`swap.tokenOnChainAmount`, {
                      amount: item.insufficientAmount?.toString(),
                      tokenSymbol: item.token.symbol,
                      chainName: item.chain?.name,
                    })}
                  </Typography>
                ))
              : null}
          </Box>
        </MessageCard>
      </Box>
    </Collapse>
  );
};

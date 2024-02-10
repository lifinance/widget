import type { TokenAmount } from '@lifi/sdk';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import type { TooltipProps } from '@mui/material';
import { Box, Collapse, Tooltip, Typography } from '@mui/material';
import type { MouseEventHandler } from 'react';
import { Fragment, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useWidgetConfig } from '../../providers';
import { formatTokenAmount } from '../../utils';
import type { CardProps } from '../Card';
import {
  Card,
  CardIconButton,
  CardLabel,
  CardLabelTypography,
  CardTitle,
} from '../Card';
import type { InsuredAmount } from '../Insurance';
import { StepActions } from '../StepActions';
import { Token } from '../Token';
import { TokenContainer } from './RouteCard.style';
import { RouteCardEssentials } from './RouteCardEssentials';
import { RouteCardEssentialsExpanded } from './RouteCardEssentialsExpanded';
import type { RouteCardProps } from './types';
import { useTokenAddressBalance } from '../../hooks';
import { FormKeyHelper, useFieldValues } from '../../stores';
import numeral from 'numeral';

const calculateTokenToAmount = (fromUSD: any, toUSD: any) => {
  const fromValue = 1 * Number(fromUSD);
  return numeral(fromValue / Number(toUSD)).format('0,0.000000');
};

export const RouteCard: React.FC<
  RouteCardProps & Omit<CardProps, 'variant'>
> = ({
  route,
  active,
  variant = 'default',
  expanded: defaulExpanded,
  ...other
}) => {
  const { t } = useTranslation();
  const { subvariant } = useWidgetConfig();
  const [cardExpanded, setCardExpanded] = useState(defaulExpanded);

  const handleExpand: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.stopPropagation();
    setCardExpanded((expanded) => !expanded);
  };

  const insurable = route.insurance?.state === 'INSURABLE';

  const token: TokenAmount =
    subvariant === 'nft'
      ? { ...route.fromToken, amount: BigInt(route.fromAmount) }
      : { ...route.toToken, amount: BigInt(route.toAmount) };

  const RecommendedTagTooltip =
    route.tags?.[0] === 'RECOMMENDED' ? RecommendedTooltip : Fragment;

  const [chainId, tokenAddress] = useFieldValues(
    FormKeyHelper.getChainKey('from'),
    FormKeyHelper.getTokenKey('from'),
  );

  const dataTokenFrom = useTokenAddressBalance(chainId, tokenAddress);

  const cardContent = (
    <Box flex={1}>
      {subvariant !== 'refuel' && (insurable || route.tags?.length) ? (
        <Box display="flex" alignItems="center" mb={2}>
          {route.tags?.length ? (
            // <RecommendedTagTooltip>
            //   <CardLabel type={active ? 'active' : undefined}>
            //     <CardLabelTypography>
            //       {t(`main.tags.${route.tags[0].toLowerCase()}` as any)}
            //     </CardLabelTypography>
            //   </CardLabel>
            // </RecommendedTagTooltip>
            <div
              style={{
                fontSize: 14,
                lineHeight: 1,
                fontWeight: 700,
              }}
            >
              Receive
            </div>
          ) : null}

          {insurable ? (
            <InsuranceTooltip
              insuredAmount={formatTokenAmount(
                BigInt(route.toAmountMin),
                route.toToken.decimals,
              )}
              insuredTokenSymbol={route.toToken.symbol}
            >
              <CardLabel type={'insurance'}>
                <VerifiedUserIcon fontSize="inherit" />
                <CardLabelTypography type="icon">
                  {t(`main.tags.insurable`)}
                </CardLabelTypography>
              </CardLabel>
            </InsuranceTooltip>
          ) : null}
        </Box>
      ) : null}

      <TokenContainer>
        <Token
          token={token}
          step={route.steps[0]}
          stepVisible={!cardExpanded}
        />
      </TokenContainer>

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: 8,
        }}
      >
        <div style={{ fontSize: 12, fontWeight: 400 }}>
          1 {dataTokenFrom?.token?.symbol} ≈{' '}
          {calculateTokenToAmount(
            dataTokenFrom?.token?.priceUSD,
            token?.priceUSD,
          )}{' '}
          {token.symbol}
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 4,
          }}
        >
          <div style={{ fontSize: 12, fontWeight: 500 }}>More Info</div>
          {!defaulExpanded ? (
            <CardIconButton onClick={handleExpand} size="small">
              {cardExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </CardIconButton>
          ) : null}
        </div>
      </div>

      <div style={{ marginTop: -8 }}>
        <Collapse timeout={225} in={cardExpanded} mountOnEnter unmountOnExit>
          {route.steps.map((step) => (
            <StepActions key={step.id} step={step} mt={2} />
          ))}
          <RouteCardEssentialsExpanded route={route} />
        </Collapse>

        <Collapse timeout={225} in={!cardExpanded} mountOnEnter unmountOnExit>
          <RouteCardEssentials route={route} />
        </Collapse>
      </div>
    </Box>
  );

  return subvariant === 'refuel' || variant === 'cardless' ? (
    cardContent
  ) : (
    <Card
      variant={active ? 'selected' : 'default'}
      selectionColor="secondary"
      indented
      {...other}
    >
      {cardContent}
    </Card>
  );
};

const InsuranceTooltip: React.FC<
  InsuredAmount & Pick<TooltipProps, 'children'>
> = ({ insuredAmount, insuredTokenSymbol, children }) => {
  const { t } = useTranslation();
  return (
    <Tooltip
      title={
        <Box component="span">
          <Typography fontSize={12} fontWeight="500">
            <Trans
              i18nKey="insurance.insure"
              values={{
                amount: insuredAmount,
                tokenSymbol: insuredTokenSymbol,
              }}
              components={[<strong />]}
            />
          </Typography>
          <Box
            sx={{
              listStyleType: 'disc',
              pl: 2,
            }}
          >
            <Typography fontSize={12} fontWeight="500" display="list-item">
              {t('insurance.bridgeExploits')}
            </Typography>
            <Typography fontSize={12} fontWeight="500" display="list-item">
              {t('insurance.slippageError')}
            </Typography>
          </Box>
        </Box>
      }
      placement="top"
      enterDelay={400}
      arrow
    >
      {children}
    </Tooltip>
  );
};

const RecommendedTooltip: React.FC<Pick<TooltipProps, 'children'>> = ({
  children,
}) => {
  const { t } = useTranslation();
  return (
    <Tooltip
      title={t('tooltip.recommended')}
      placement="top"
      enterDelay={400}
      arrow
    >
      {children}
    </Tooltip>
  );
};

import {
  AccessTime as AccessTimeIcon,
  EvStationOutlined as EvStationIcon,
  ExpandLess as ExpandLessIcon,
  ExpandMore as ExpandMoreIcon,
  LayersOutlined as LayersIcon,
} from '@mui/icons-material';
import { Box, Collapse, Tooltip, Typography } from '@mui/material';
import type { MouseEventHandler } from 'react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useWidgetConfig } from '../../providers';
import type { CardProps } from '../Card';
import { Card } from '../Card';
import { StepActions } from '../StepActions';
import { Token } from '../Token';
import { IconButton, Label } from './SwapRouteCard.style';
import type { SwapRouteCardEssentialsProps, SwapRouteCardProps } from './types';
import { getGasCostsBreakdown } from './utils';

export const SwapRouteCard: React.FC<
  SwapRouteCardProps & Omit<CardProps, 'variant'>
> = ({ route, active, variant = 'default', expanded, ...other }) => {
  const { t } = useTranslation();
  const { variant: widgetVariant, useRecommendedRoute } = useWidgetConfig();
  const [cardExpanded, setCardExpanded] = useState(
    variant === 'default' || expanded,
  );
  const alternativeTag = t(`swap.tags.ALTERNATIVE`);
  const label = route.tags?.length
    ? t(`swap.tags.${route.tags[0]}` as any)
    : alternativeTag;

  const handleExpand: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.stopPropagation();
    setCardExpanded((expanded) => !expanded);
  };

  const token =
    widgetVariant === 'nft'
      ? { ...route.fromToken, amount: route.fromAmount }
      : { ...route.toToken, amount: route.toAmount };

  const cardContent = (
    <Box flex={1}>
      {widgetVariant !== 'refuel' && !useRecommendedRoute ? (
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
        >
          <Label active={active ?? label !== alternativeTag}>{label}</Label>
          {variant === 'stretched' ? (
            <SwapRouteCardEssentials route={route} />
          ) : null}
        </Box>
      ) : null}
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Token
          token={token}
          step={variant === 'stretched' ? route.steps[0] : undefined}
          disableDescription={variant === 'dense' && widgetVariant !== 'refuel'}
        />
        {variant === 'stretched' && !expanded ? (
          <IconButton onClick={handleExpand} size="small">
            {cardExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </IconButton>
        ) : null}
      </Box>
      <Collapse timeout={225} in={cardExpanded} mountOnEnter unmountOnExit>
        {route.steps.map((step) => (
          <StepActions key={step.id} step={step} mt={2} />
        ))}
      </Collapse>
      {variant !== 'stretched' ? (
        <SwapRouteCardEssentials route={route} dense />
      ) : null}
    </Box>
  );

  return widgetVariant === 'refuel' ? (
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

export const SwapRouteCardEssentials: React.FC<
  SwapRouteCardEssentialsProps
> = ({ route, dense }) => {
  const { t } = useTranslation();
  const executionTimeMinutes = Math.ceil(
    route.steps
      .map((step) => step.estimate.executionDuration)
      .reduce((duration, x) => duration + x, 0) / 60,
  );
  const gasCostUSD = parseFloat(route.gasCostUSD ?? '') || 0.01;
  const gasCosts = getGasCostsBreakdown(route);
  return (
    <Box
      display="flex"
      justifyContent={dense ? 'space-between' : 'flex-end'}
      flex={1}
      pl={dense ? 0 : 2}
      mt={dense ? 2 : 0}
    >
      <Tooltip
        title={
          <Box component="span">
            {t(`tooltip.estimatedNetworkFee`)}
            {gasCosts.map((gas) => (
              <Typography
                fontSize={11}
                key={`${gas.token.address}${gas.token.symbol}`}
              >
                {gas.amount?.toFixed(6)} {gas.token.symbol} (
                {t(`format.currency`, { value: gas.amountUSD })})
              </Typography>
            ))}
          </Box>
        }
        placement="top"
        enterDelay={400}
        arrow
      >
        <Box display="flex" alignItems="center" mr={dense ? 0 : 2}>
          <Typography lineHeight={0} mr={0.5} color="grey.500">
            <EvStationIcon fontSize={dense ? 'medium' : 'small'} />
          </Typography>
          <Typography
            fontSize={14}
            color="text.primary"
            fontWeight="500"
            lineHeight={1}
          >
            {t(`format.currency`, { value: gasCostUSD })}
          </Typography>
        </Box>
      </Tooltip>
      <Tooltip
        title={t(`tooltip.estimatedTime`)}
        placement="top"
        enterDelay={400}
        arrow
      >
        <Box display="flex" alignItems="center" mr={dense ? 0 : 2}>
          <Typography lineHeight={0} mr={0.5} color="grey.500">
            <AccessTimeIcon fontSize={dense ? 'medium' : 'small'} />
          </Typography>
          <Typography
            fontSize={14}
            color="text.primary"
            fontWeight="500"
            lineHeight={1}
          >
            {t('swap.estimatedTime', {
              value: executionTimeMinutes,
            })}
          </Typography>
        </Box>
      </Tooltip>
      {!dense ? (
        <Tooltip
          title={t(`tooltip.numberOfSteps`)}
          placement="top"
          enterDelay={400}
          arrow
        >
          <Box display="flex" alignItems="center">
            <Typography lineHeight={0} mr={0.5} color="grey.500">
              <LayersIcon fontSize={dense ? 'medium' : 'small'} />
            </Typography>
            <Typography
              fontSize={14}
              color="text.primary"
              fontWeight="500"
              lineHeight={1}
            >
              {route.steps.length}
            </Typography>
          </Box>
        </Tooltip>
      ) : null}
    </Box>
  );
};

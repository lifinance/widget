import {
  AccessTime as AccessTimeIcon,
  EvStationOutlined as EvStationIcon,
  ExpandLess as ExpandLessIcon,
  ExpandMore as ExpandMoreIcon,
  LayersOutlined as LayersIcon,
} from '@mui/icons-material';
import type { BoxProps } from '@mui/material';
import { Box, Collapse, Typography } from '@mui/material';
import type { MouseEventHandler } from 'react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card } from '../Card';
import { StepActions } from '../StepActions';
import { Token } from '../Token';
import { IconButton, Label } from './SwapRouteCard.style';
import type { SwapRouteCardEssentialsProps, SwapRouteCardProps } from './types';

export const SwapRouteCard: React.FC<SwapRouteCardProps & BoxProps> = ({
  route,
  active,
  variant = 'default',
  ...other
}) => {
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState(variant === 'default');
  const alternativeTag = t(`swap.tags.ALTERNATIVE`);
  const label = route.tags?.length
    ? t(`swap.tags.${route.tags[0]}` as any)
    : alternativeTag;

  const handleExpand: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.stopPropagation();
    setExpanded((expanded) => !expanded);
  };
  return (
    <Card
      dense={variant === 'dense'}
      variant={active ? 'selected' : 'default'}
      selectionColor="secondary"
      indented
      {...other}
    >
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Label active={active ?? label !== alternativeTag}>{label}</Label>
        {variant === 'extended' ? (
          <SwapRouteCardEssentials route={route} />
        ) : null}
      </Box>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Token
          token={{ ...route.toToken, amount: route.toAmount }}
          step={variant === 'extended' ? route.steps[0] : undefined}
        />
        {variant === 'extended' ? (
          <IconButton onClick={handleExpand} size="small">
            {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </IconButton>
        ) : null}
      </Box>
      <Collapse mountOnEnter unmountOnExit in={expanded}>
        {route.steps.map((step) => (
          <StepActions key={step.id} step={step} mt={2} />
        ))}
      </Collapse>
      {variant !== 'extended' ? (
        <SwapRouteCardEssentials route={route} dense />
      ) : null}
    </Card>
  );
};

export const SwapRouteCardEssentials: React.FC<
  SwapRouteCardEssentialsProps
> = ({ route, dense }) => {
  const { t } = useTranslation();
  return (
    <Box
      display="flex"
      justifyContent={dense ? 'space-between' : 'flex-end'}
      flex={1}
      pl={dense ? 0 : 2}
      mt={dense ? 2 : 0}
    >
      <Box display="flex" alignItems="center" pr={dense ? 0 : 2}>
        <Typography lineHeight={0} mr={0.5} color="grey.500">
          <EvStationIcon fontSize={dense ? 'medium' : 'small'} />
        </Typography>
        <Typography
          fontSize={14}
          color="text.primary"
          fontWeight="500"
          lineHeight={1}
        >
          {t(`swap.currency`, { value: route.gasCostUSD ?? 0 })}
        </Typography>
      </Box>
      <Box display="flex" alignItems="center" pr={dense ? 0 : 2}>
        <Typography lineHeight={0} mr={0.5} color="grey.500">
          <AccessTimeIcon fontSize={dense ? 'medium' : 'small'} />
        </Typography>
        <Typography
          fontSize={14}
          color="text.primary"
          fontWeight="500"
          lineHeight={1}
        >
          {`${(
            route.steps
              .map((step) => step.estimate.executionDuration)
              .reduce((duration, x) => duration + x) / 60
          ).toFixed(0)}m`}
        </Typography>
      </Box>
      {!dense ? (
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
      ) : null}
    </Box>
  );
};

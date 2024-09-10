import type { Theme } from '@mui/material';
import { useMediaQuery } from '@mui/material';
import { useWidgetConfig } from '../providers/WidgetProvider/WidgetProvider.js';

const defaultExpandableWidth = 852;

export const useWideVariant = () => {
  const { variant, useRecommendedRoute } = useWidgetConfig();
  const expandableAllowed = useMediaQuery((theme: Theme) =>
    theme.breakpoints.up(defaultExpandableWidth),
  );
  return variant === 'wide' && expandableAllowed && !useRecommendedRoute;
};

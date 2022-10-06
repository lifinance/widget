import type { Theme } from '@mui/material';
import { useMediaQuery } from '@mui/material';
import { useWidgetConfig } from '../providers';

const defaultExpandableWidth = 852;

export const useExpandableVariant = () => {
  const { variant } = useWidgetConfig();
  const expandableAllowed = useMediaQuery((theme: Theme) => {
    return theme.breakpoints.up(defaultExpandableWidth);
  });
  return variant === 'expandable' && expandableAllowed;
};

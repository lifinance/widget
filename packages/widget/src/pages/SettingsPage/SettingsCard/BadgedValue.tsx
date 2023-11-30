import type { PropsWithChildren } from 'react';
import type { BadgeProps } from '@mui/material';
import { SummaryValue, Badge } from './SettingCard.style';

interface BadgedValueProps {
  showBadge: boolean;
  badgeColor?: BadgeProps['color'];
}

export const BadgedValue: React.FC<PropsWithChildren<BadgedValueProps>> = ({
  showBadge,
  badgeColor,
  children,
}) =>
  showBadge && badgeColor ? (
    <Badge variant="dot" color={badgeColor}>
      <SummaryValue>{children}</SummaryValue>
    </Badge>
  ) : (
    <SummaryValue>{children}</SummaryValue>
  );

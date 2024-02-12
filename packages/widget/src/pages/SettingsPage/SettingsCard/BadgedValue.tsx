import type { BadgeProps } from '@mui/material';
import type { PropsWithChildren } from 'react';
import { CardValue } from '../../../components/Card/CardButton.style.js';
import { Badge } from './SettingCard.style.js';

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
      <CardValue>{children}</CardValue>
    </Badge>
  ) : (
    <CardValue>{children}</CardValue>
  );

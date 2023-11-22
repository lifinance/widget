import type { PropsWithChildren } from 'react';
import type { BadgeProps } from '@mui/material';
import { Badge } from '../../../components/Badge';
import { SettingSummaryText } from './SettingCard.style';

interface BadgedAdditionalInformationProps {
  showBadge: boolean;
  badgeColor?: BadgeProps['color'];
}

export const BadgedAdditionalInformation: React.FC<
  PropsWithChildren<BadgedAdditionalInformationProps>
> = ({ showBadge, badgeColor, children }) =>
  showBadge && badgeColor ? (
    <Badge variant="dot" color={badgeColor}>
      <SettingSummaryText>{children}</SettingSummaryText>
    </Badge>
  ) : (
    <SettingSummaryText>{children}</SettingSummaryText>
  );

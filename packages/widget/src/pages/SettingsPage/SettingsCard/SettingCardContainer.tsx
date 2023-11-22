import type { PropsWithChildren } from 'react';
import type { SettingCardTitle } from './SettingCard.types';
import { SettingCard } from './SettingCard';
import {
  SettingSummary,
  SettingTitle,
  SettingSummaryText,
} from './SettingCard.style';

export const SettingCardContainer: React.FC<
  PropsWithChildren<SettingCardTitle>
> = ({ icon, title, children }) => (
  <SettingCard>
    <SettingSummary>
      <SettingTitle>
        {icon}
        <SettingSummaryText>{title}</SettingSummaryText>
      </SettingTitle>
      {children}
    </SettingSummary>
  </SettingCard>
);

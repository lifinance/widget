import type { MouseEventHandler, PropsWithChildren } from 'react';
import type { SettingCardTitle } from './SettingCard.types';
import { SettingCard } from './SettingCard';
import {
  SettingSummaryButton,
  SettingSummaryText,
  SettingTitle,
} from './SettingCard.style';

interface SettingCardButtonProps extends SettingCardTitle {
  onClick: MouseEventHandler;
}
export const SettingCardButton: React.FC<
  PropsWithChildren<SettingCardButtonProps>
> = ({ onClick, icon, title, children }) => (
  <SettingCard>
    <SettingSummaryButton onClick={onClick} focusRipple>
      <SettingTitle>
        {icon}
        <SettingSummaryText>{title}</SettingSummaryText>
      </SettingTitle>
      {children}
    </SettingSummaryButton>
  </SettingCard>
);

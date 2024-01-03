import type { MouseEventHandler, PropsWithChildren } from 'react';
import type { SettingCardTitle } from '../pages/SettingsPage/SettingsCard/types';
import { SettingCard } from '../pages/SettingsPage/SettingsCard/SettingCard';
import {
  SummaryRowButton,
  SummaryValue,
  SummaryTitleContainer,
} from '../pages/SettingsPage/SettingsCard/SettingCard.style';

interface SettingCardButtonProps extends SettingCardTitle {
  onClick: MouseEventHandler;
}

export const CardButton: React.FC<
  PropsWithChildren<SettingCardButtonProps>
> = ({ onClick, icon, title, children }) => (
  <SettingCard>
    <SummaryRowButton onClick={onClick} disableRipple>
      <SummaryTitleContainer>
        {icon}
        <SummaryValue>{title}</SummaryValue>
      </SummaryTitleContainer>
      {children}
    </SummaryRowButton>
  </SettingCard>
);

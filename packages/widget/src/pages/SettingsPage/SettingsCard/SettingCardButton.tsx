import type { MouseEventHandler, PropsWithChildren } from 'react';
import type { SettingCardTitle } from './types';
import { SettingCard } from './SettingCard';
import {
  SummaryRowButton,
  SummaryValue,
  SummaryTitleContainer,
} from './SettingCard.style';

interface SettingCardButtonProps extends SettingCardTitle {
  onClick: MouseEventHandler;
}

export const SettingCardButton: React.FC<
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

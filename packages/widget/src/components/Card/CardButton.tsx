import type { MouseEventHandler, PropsWithChildren } from 'react';
import type { SettingCardTitle } from '../../pages/SettingsPage/SettingsCard/types.js';
import { Card } from './Card.js';
import {
  CardRowButton,
  CardTitleContainer,
  CardValue,
} from './CardButton.style.js';

interface SettingCardButtonProps extends SettingCardTitle {
  onClick: MouseEventHandler;
}

export const CardButton: React.FC<
  PropsWithChildren<SettingCardButtonProps>
> = ({ onClick, icon, title, children }) => (
  <Card>
    <CardRowButton onClick={onClick} disableRipple>
      <CardTitleContainer>
        {icon}
        <CardValue>{title}</CardValue>
      </CardTitleContainer>
      {children}
    </CardRowButton>
  </Card>
);

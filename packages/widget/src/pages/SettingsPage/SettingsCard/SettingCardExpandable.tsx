import type { PropsWithChildren, ReactNode } from 'react';
import { useId } from 'react';
import { Collapse } from '@mui/material';
import type { SettingCardTitle } from './types';
import { SettingCard } from './SettingCard';
import {
  SummaryRowButton,
  SummaryValue,
  SummaryTitleContainer,
} from './SettingCard.style';
import { useSettingsCardExpandable } from './SettingsAccordian';

interface SettingCardExpandableProps extends SettingCardTitle {
  value: ReactNode;
}

export const SettingCardExpandable: React.FC<
  PropsWithChildren<SettingCardExpandableProps>
> = ({ icon, title, value, children }) => {
  const { expanded, toggleExpanded } = useSettingsCardExpandable();
  const buttonId = useId();
  const collapseId = useId();

  return (
    <SettingCard>
      <SummaryRowButton
        id={buttonId}
        aria-expanded={expanded}
        aria-controls={collapseId}
        onClick={toggleExpanded}
        disableRipple
      >
        <SummaryTitleContainer>
          {icon}
          <SummaryValue>{title}</SummaryValue>
        </SummaryTitleContainer>
        {!expanded && value}
      </SummaryRowButton>
      <Collapse
        id={collapseId}
        role="region"
        aria-labelledby={buttonId}
        in={expanded}
      >
        {children}
      </Collapse>
    </SettingCard>
  );
};

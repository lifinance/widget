import type { PropsWithChildren, ReactNode } from 'react';
import { useId, useState } from 'react';
import { Collapse } from '@mui/material';
import type { SettingCardTitle } from './SettingCard.types';
import { SettingCard } from './SettingCard';
import {
  SettingSummaryButton,
  SettingSummaryText,
  SettingTitle,
} from './SettingCard.style';

interface SettingCardExpandableProps extends SettingCardTitle {
  additionalInfo: ReactNode;
}
export const SettingCardExpandable: React.FC<
  PropsWithChildren<SettingCardExpandableProps>
> = ({ icon, title, additionalInfo, children }) => {
  const [expanded, setExpanded] = useState(false);
  const buttonId = useId();
  const collapseId = useId();
  const toggleExpanded = () => {
    setExpanded((currentExpanded) => !currentExpanded);
  };

  return (
    <SettingCard>
      <SettingSummaryButton
        id={buttonId}
        aria-expanded={expanded}
        aria-controls={collapseId}
        onClick={toggleExpanded}
        focusRipple
      >
        <SettingTitle>
          {icon}
          <SettingSummaryText>{title}</SettingSummaryText>
        </SettingTitle>
        {!expanded && additionalInfo}
      </SettingSummaryButton>
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

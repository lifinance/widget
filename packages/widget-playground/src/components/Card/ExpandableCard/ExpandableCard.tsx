import type { FC, PropsWithChildren, ReactNode } from 'react';
import { useId } from 'react';
import { Collapse } from '@mui/material';
import {
  Card,
  CardRowButton,
  CardValue,
  CardTitleContainer,
} from '../Card.style';
import { useExpandableCard } from './useExpandableCard';

interface ExpandableCardProps {
  icon?: ReactNode;
  title: ReactNode;
  value: ReactNode;
}

export const ExpandableCard: FC<PropsWithChildren<ExpandableCardProps>> = ({
  icon,
  title,
  value,
  children,
}) => {
  const { expanded, toggleExpanded } = useExpandableCard();
  const buttonId = useId();
  const collapseId = useId();

  return (
    <Card sx={{ p: 1 }}>
      <CardRowButton
        id={buttonId}
        aria-expanded={expanded}
        aria-controls={collapseId}
        onClick={toggleExpanded}
        disableRipple
        sx={{ p: 1 }}
      >
        <CardTitleContainer sx={{ minHeight: 24 }}>
          {icon}
          <CardValue>{title}</CardValue>
        </CardTitleContainer>
        {!expanded && value}
      </CardRowButton>
      <Collapse
        id={collapseId}
        role="region"
        aria-labelledby={buttonId}
        in={expanded}
      >
        {children}
      </Collapse>
    </Card>
  );
};

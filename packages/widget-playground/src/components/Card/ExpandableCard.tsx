import { Collapse } from '@mui/material'
import type { FC, PropsWithChildren, ReactNode } from 'react'
import { useId } from 'react'
import {
  Card,
  CardRowButton,
  CardTitleContainer,
  CardValue,
} from './Card.style.js'
import { useExpandableCard } from './useExpandableCard.js'

interface ExpandableCardProps {
  icon?: ReactNode
  title: ReactNode
  value: ReactNode
  alwaysShowTitleValue?: boolean
  dataTestId?: string
}

export const ExpandableCard: FC<PropsWithChildren<ExpandableCardProps>> = ({
  icon,
  title,
  value,
  children,
  alwaysShowTitleValue,
  dataTestId,
}) => {
  const { expanded, toggleExpanded } = useExpandableCard()
  const buttonId = useId()
  const collapseId = useId()

  return (
    <Card sx={{ p: 1 }}>
      <CardRowButton
        id={buttonId}
        aria-expanded={expanded}
        aria-controls={collapseId}
        onClick={toggleExpanded}
        disableRipple
        sx={{ p: 1 }}
        data-testid={dataTestId}
      >
        <CardTitleContainer sx={{ minHeight: 24 }}>
          {icon}
          <CardValue>{title}</CardValue>
        </CardTitleContainer>
        {!expanded || alwaysShowTitleValue ? value : null}
      </CardRowButton>
      {/** biome-ignore lint/a11y/useSemanticElements: allowed in react */}
      <Collapse
        id={collapseId}
        role="region"
        aria-labelledby={buttonId}
        in={expanded}
      >
        {children}
      </Collapse>
    </Card>
  )
}

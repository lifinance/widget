import { Collapse } from '@mui/material'
import type { FC, PropsWithChildren, ReactNode } from 'react'
import { useId } from 'react'
import {
  Card,
  CardRowButton,
  CardTitleContainer,
  CardValue,
} from './Card.style'
import { useExpandableCard } from './useExpandableCard'

interface ExpandableCardProps {
  icon?: ReactNode
  title: ReactNode
  value: ReactNode
  alwaysShowTitleValue?: boolean
}

export const ExpandableCard: FC<PropsWithChildren<ExpandableCardProps>> = ({
  icon,
  title,
  value,
  children,
  alwaysShowTitleValue,
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
      >
        <CardTitleContainer sx={{ minHeight: 24 }}>
          {icon}
          <CardValue>{title}</CardValue>
        </CardTitleContainer>
        {!expanded || alwaysShowTitleValue ? value : null}
      </CardRowButton>
      <Collapse
        id={collapseId}
        // biome-ignore lint/a11y/useSemanticElements:
        role="region"
        aria-labelledby={buttonId}
        in={expanded}
      >
        {children}
      </Collapse>
    </Card>
  )
}

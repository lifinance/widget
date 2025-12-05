import { Collapse } from '@mui/material'
import type { PropsWithChildren, ReactNode } from 'react'
import { forwardRef, useId, useImperativeHandle, useRef } from 'react'
import { Card } from '../../../components/Card/Card.js'
import {
  CardRowButton,
  CardTitleContainer,
  CardValue,
} from '../../../components/Card/CardButton.style.js'
import { useSettingsCardExpandable } from './SettingsAccordian.js'
import type { SettingCardTitle } from './types.js'

interface SettingCardExpandableProps extends SettingCardTitle {
  value: ReactNode
  disabled?: boolean
  keepValueVisible?: boolean
  onEntered?: () => void
}

export interface SettingCardExpandableRef {
  element: HTMLButtonElement | null
  isExpanded: boolean
  toggleExpanded: (forceExpanded?: boolean) => void
}

export const SettingCardExpandable = forwardRef<
  SettingCardExpandableRef,
  PropsWithChildren<SettingCardExpandableProps>
>(
  (
    { icon, title, value, children, disabled, keepValueVisible, onEntered },
    ref
  ) => {
    const { expanded, toggleExpanded } = useSettingsCardExpandable()
    const buttonId = useId()
    const collapseId = useId()
    const buttonRef = useRef<HTMLButtonElement>(null)

    useImperativeHandle(
      ref,
      () => ({
        element: buttonRef.current,
        isExpanded: expanded,
        toggleExpanded,
      }),
      [expanded, toggleExpanded]
    )

    return (
      <Card sx={{ p: 1 }}>
        <CardRowButton
          ref={buttonRef}
          id={buttonId}
          aria-expanded={expanded}
          aria-controls={collapseId}
          onClick={disabled ? undefined : () => toggleExpanded()}
          disableRipple
          sx={{ p: 1, cursor: disabled ? 'default' : 'pointer' }}
        >
          <CardTitleContainer>
            {icon}
            <CardValue>{title}</CardValue>
          </CardTitleContainer>
          {(!expanded || keepValueVisible) && value}
        </CardRowButton>
        <Collapse
          id={collapseId}
          role="region"
          aria-labelledby={buttonId}
          in={expanded}
          mountOnEnter
          unmountOnExit
          onEntered={onEntered}
        >
          {children}
        </Collapse>
      </Card>
    )
  }
)

import type { BoxProps } from '@mui/material'
import { useEffect, useState } from 'react'
import {
  ExpansionSlideContent,
  ExpansionSlideWrapper,
} from './ExpansionSlide.style'

interface ExpansionSlideProps extends BoxProps {
  open: boolean
  expansionWidth: string | number
  expansionHeight: string | number
  delay?: number
}

export const ExpansionSlide: React.FC<ExpansionSlideProps> = ({
  open,
  expansionWidth,
  expansionHeight,
  delay = 0,
  children,
}) => {
  const [delayedOpen, setDelayedOpen] = useState(false)

  // Make sure delayedOpen state update (start of the animation)
  // does not happen during rendering. setTimeout schedules
  // the start of the animation after the DOM has been updated.
  useEffect(() => {
    const timer = setTimeout(() => setDelayedOpen(open), delay)
    return () => {
      clearTimeout(timer)
    }
  }, [open, delay])

  return (
    <ExpansionSlideWrapper open={delayedOpen} expansionWidth={expansionWidth}>
      <ExpansionSlideContent
        open={delayedOpen}
        expansionWidth={expansionWidth}
        expansionHeight={expansionHeight}
      >
        {children}
      </ExpansionSlideContent>
    </ExpansionSlideWrapper>
  )
}

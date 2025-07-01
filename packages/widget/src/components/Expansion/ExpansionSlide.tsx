import type { BoxProps } from '@mui/material'
import { useEffect, useState } from 'react'
import { ExpansionSlideContent } from './ExpansionSlide.style'

interface ExpansionSlideProps extends BoxProps {
  open: boolean
  expansionWidth: string | number
  delay?: number
}

export const ExpansionSlide: React.FC<ExpansionSlideProps> = ({
  open,
  expansionWidth,
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
    <ExpansionSlideContent open={delayedOpen} expansionWidth={expansionWidth}>
      {children}
    </ExpansionSlideContent>
  )
}

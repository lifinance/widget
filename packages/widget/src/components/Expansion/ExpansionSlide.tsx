import type { BoxProps } from '@mui/material'
import { useEffect, useState } from 'react'
import {
  ExpansionSlideContent,
  ExpansionSlideWrapper,
} from './ExpansionSlide.style'

interface ExpansionSlideProps extends BoxProps {
  open: boolean
  delay?: number
}

export const ExpansionSlide: React.FC<ExpansionSlideProps> = ({
  open,
  delay = 225,
  children,
}) => {
  const [delayedOpen, setDelayedOpen] = useState(false)

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>
    if (open) {
      timer = setTimeout(() => setDelayedOpen(open), delay)
    }
    return () => {
      if (timer) {
        clearTimeout(timer)
      }
    }
  }, [open, delay])

  return (
    <ExpansionSlideWrapper open={delayedOpen}>
      <ExpansionSlideContent open={delayedOpen}>
        {children}
      </ExpansionSlideContent>
    </ExpansionSlideWrapper>
  )
}

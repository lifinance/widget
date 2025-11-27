import { Box } from '@mui/material'
import { type PropsWithChildren, useRef } from 'react'
import { Transition } from 'react-transition-group'
import {
  animationDuration,
  defaultStyle,
  transitionStyles,
} from './Expansion.style'

interface ExpansionTransitionProps {
  in: boolean
  width: string
  onExited?: () => void
}

export function ExpansionTransition({
  in: inProp,
  children,
  width,
  onExited,
}: PropsWithChildren<ExpansionTransitionProps>) {
  const nodeRef = useRef(null)
  return (
    <Transition
      nodeRef={nodeRef}
      in={inProp}
      timeout={animationDuration}
      onExited={onExited}
      mountOnEnter
      unmountOnExit
    >
      {(state) => {
        return (
          <Box
            ref={nodeRef}
            style={{
              ...defaultStyle,
              ...transitionStyles[state as keyof typeof transitionStyles],
              width,
            }}
          >
            {children}
          </Box>
        )
      }}
    </Transition>
  )
}

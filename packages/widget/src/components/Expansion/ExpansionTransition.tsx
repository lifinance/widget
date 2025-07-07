import { Box } from '@mui/material'
import { type PropsWithChildren, useRef } from 'react'
import { Transition } from 'react-transition-group'

export const animationDuration = 225

const defaultStyle = {
  opacity: 0,
  whiteSpace: 'nowrap',
  transform: 'translateX(-100%)',
  display: 'inline-block',
  position: 'absolute' as const,
  top: 0,
  left: 0,
  willChange: 'opacity, transform',
  transition: `opacity ${animationDuration}ms cubic-bezier(0.4, 0, 0.2, 1), transform ${animationDuration}ms cubic-bezier(0.4, 0, 0.2, 1)`,
}

const transitionStyles = {
  entering: {
    opacity: 1,
    transform: 'translateX(0)',
  },
  entered: {
    opacity: 1,
    transform: 'translateX(0)',
  },
  exiting: {
    opacity: 0,
    transform: 'translateX(-100%)',
  },
  exited: {
    opacity: 0,
    transform: 'translateX(-100%)',
  },
}

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

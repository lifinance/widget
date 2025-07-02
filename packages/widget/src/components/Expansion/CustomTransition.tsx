import { Box, keyframes } from '@mui/material'
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
}

const slideIn = keyframes`
  from {
    opacity: 0;
    transform: translateX(-100%);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`

const slideOut = keyframes`
  from {
    opacity: 1;
    transform: translateX(0);
  }
  to {
    opacity: 0;
    transform: translateX(-100%);
  }
`
const transitionStyles = {
  entering: {
    animation: `${slideIn} ${animationDuration}ms ease-in-out`,
  },
  entered: {
    opacity: 1,
    transform: 'translateX(0)',
  },
  exiting: {
    animation: `${slideOut} ${animationDuration}ms ease-in-out`,
  },
  exited: {
    opacity: 0,
    transform: 'translateX(-100%)',
  },
}

interface CustomTransitionProps {
  in: boolean
  width?: number | string
  onExited?: () => void
}

export function CustomTransition({
  in: inProp,
  children,
  width = 430,
  onExited,
}: PropsWithChildren<CustomTransitionProps>) {
  const nodeRef = useRef(null)
  return (
    <Transition
      nodeRef={nodeRef}
      in={inProp}
      timeout={animationDuration}
      onExited={onExited}
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

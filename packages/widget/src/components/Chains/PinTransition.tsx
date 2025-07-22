import { Box } from '@mui/material'
import { type PropsWithChildren, useRef } from 'react'
import { Transition } from 'react-transition-group'

export const animationDuration = 225

const defaultStyle = {
  opacity: 0,
  transform: 'translateY(-100%)',
  position: 'absolute',
  top: 0,
  right: 0,
  willChange: 'opacity, transform',
  transition: `opacity ${animationDuration}ms cubic-bezier(0.4, 0, 0.2, 1), transform ${animationDuration}ms cubic-bezier(0.4, 0, 0.2, 1)`,
}

const transitionStyles: Record<string, React.CSSProperties> = {
  entering: {
    opacity: 1,
    transform: 'translateY(0)',
    transition: `opacity ${animationDuration}ms cubic-bezier(0.4, 0, 0.2, 1) 50ms, transform ${animationDuration}ms cubic-bezier(0.4, 0, 0.2, 1)`,
  },
  entered: { opacity: 1, transform: 'translateY(0)' },
  exiting: {
    opacity: 0,
    transform: 'translateY(-100%)',
  },
  exited: { opacity: 0, transform: 'translateY(-100%)' },
}

interface PinTransitionProps {
  in: boolean
  isPinned: boolean
}

export const PinTransition = ({
  in: inProp,
  isPinned,
  children,
}: PropsWithChildren<PinTransitionProps>) => {
  const nodeRef = useRef(null)

  if (isPinned) {
    // Always visible, no animation
    return (
      <Box
        ref={nodeRef}
        sx={{
          ...defaultStyle,
          ...transitionStyles.entered, // Always show as "entered"
        }}
      >
        {children}
      </Box>
    )
  }

  return (
    <Transition
      nodeRef={nodeRef}
      in={inProp}
      timeout={animationDuration}
      appear={false}
      mountOnEnter
      unmountOnExit
    >
      {(state) => (
        <Box
          ref={nodeRef}
          sx={{
            ...defaultStyle,
            ...transitionStyles[state],
          }}
        >
          {children}
        </Box>
      )}
    </Transition>
  )
}

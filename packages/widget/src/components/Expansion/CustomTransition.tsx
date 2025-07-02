import { useRef } from 'react'
import { Transition } from 'react-transition-group'

const duration = 225

const defaultStyle = {
  transition: `opacity ${duration}ms ease-in-out, transform ${duration}ms ease-in-out`,
  opacity: 0,
  whiteSpace: 'nowrap',
  transform: 'translateX(-100%)',
  display: 'inline-block',
  position: 'absolute' as const,
  top: 0,
  left: 0,
}

const transitionStyles = {
  entering: { opacity: 1, transform: 'translateX(0)' },
  entered: { opacity: 1, transform: 'translateX(0)' },
  exiting: { opacity: 0, transform: 'translateX(-100%)' },
  exited: { opacity: 0, transform: 'translateX(-100%)' },
}

export function CustomTransition({
  in: inProp,
  children,
  width = 430,
}: {
  in: boolean
  children: React.ReactNode
  width?: number | string
}) {
  const nodeRef = useRef(null)
  return (
    <Transition nodeRef={nodeRef} in={inProp} timeout={duration}>
      {(state) => {
        return (
          <div
            ref={nodeRef}
            style={{
              ...defaultStyle,
              ...transitionStyles[state as keyof typeof transitionStyles],
              width: width,
            }}
          >
            {children}
          </div>
        )
      }}
    </Transition>
  )
}

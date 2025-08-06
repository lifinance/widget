import { Box, styled } from '@mui/material'

export const animationDuration = 225

export const defaultStyle = {
  opacity: 0,
  whiteSpace: 'nowrap',
  transform: 'translateX(-100%)',
  display: 'inline-block',
  position: 'absolute' as const,
  top: 0,
  left: 0,
  transition: `opacity ${animationDuration}ms cubic-bezier(0.4, 0, 0.2, 1), transform ${animationDuration}ms cubic-bezier(0.4, 0, 0.2, 1)`,
}

export const transitionStyles = {
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

export const ExpansionContainer = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'width',
})<{ width: string | number }>(({ width }) => ({
  position: 'relative',
  display: 'flex',
  transition: `width ${animationDuration}ms cubic-bezier(0.4, 0, 0.2, 1)`,
  width: width,
  marginLeft: width ? '24px' : 0,
}))

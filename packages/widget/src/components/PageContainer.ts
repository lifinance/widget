import type { ContainerProps } from '@mui/material'
import { Container, styled } from '@mui/material'

export interface PageContainerProps extends ContainerProps {
  halfGutters?: boolean
  topGutters?: boolean
  bottomGutters?: boolean
}

export const PageContainer = styled(Container, {
  shouldForwardProp: (prop) =>
    !['halfGutters', 'topGutters', 'bottomGutters'].includes(prop as string),
})<PageContainerProps>(({ theme, halfGutters, topGutters, bottomGutters }) => ({
  display: 'flex',
  flexDirection: 'column',
  flex: 1,
  padding: theme.spacing(
    topGutters ? 1 : 0,
    halfGutters ? 1.5 : 3,
    bottomGutters ? 3 : 0,
    halfGutters ? 1.5 : 3
  ),
  variants: [
    {
      props: ({ disableGutters }) => disableGutters,
      style: {
        padding: 0,
      },
    },
  ],
}))

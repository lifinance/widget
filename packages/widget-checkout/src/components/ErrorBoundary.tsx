import { Box, Button, Typography } from '@mui/material'
import type { TFunction } from 'i18next'
import type { JSX, ReactNode } from 'react'
import { Component, type ErrorInfo, type PropsWithChildren } from 'react'
import { useTranslation } from 'react-i18next'

interface State {
  error: Error | null
}

interface InnerProps extends PropsWithChildren {
  t: TFunction
}

class ErrorBoundaryInner extends Component<InnerProps, State> {
  state: State = { error: null }

  static getDerivedStateFromError(error: Error): State {
    return { error }
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error('[LifiWidgetCheckout] Render error:', error, info)
  }

  handleRetry = (): void => {
    this.setState({ error: null })
  }

  render(): ReactNode {
    if (this.state.error) {
      const { t } = this.props
      return (
        <Box sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="h6" gutterBottom>
            {t('error.title.unknown')}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {t('error.message.unknown')}
          </Typography>
          <Button variant="outlined" onClick={this.handleRetry}>
            {t('button.tryAgain')}
          </Button>
        </Box>
      )
    }
    return this.props.children
  }
}

export function ErrorBoundary({ children }: PropsWithChildren): JSX.Element {
  const { t } = useTranslation()
  return <ErrorBoundaryInner t={t}>{children}</ErrorBoundaryInner>
}

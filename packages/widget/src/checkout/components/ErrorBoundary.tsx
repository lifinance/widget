import { Box, Button, Typography } from '@mui/material'
import { Component, type ErrorInfo, type PropsWithChildren } from 'react'

interface State {
  error: Error | null
}

export class ErrorBoundary extends Component<PropsWithChildren, State> {
  state: State = { error: null }

  static getDerivedStateFromError(error: Error): State {
    return { error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('[LifiWidgetCheckout] Render error:', error, info)
  }

  handleRetry = () => {
    this.setState({ error: null })
  }

  render() {
    if (this.state.error) {
      return (
        <Box sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="h6" gutterBottom>
            Something went wrong
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {this.state.error.message}
          </Typography>
          <Button variant="outlined" onClick={this.handleRetry}>
            Try again
          </Button>
        </Box>
      )
    }
    return this.props.children
  }
}

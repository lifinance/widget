import type { RouteExtended } from '@lifi/sdk'
import { PageContainer } from '@lifi/widget/src/components/PageContainer'
import { TransactionExecutionContent } from '@lifi/widget/src/pages/TransactionPage/TransactionExecutionContent'
import type { RouteExecutionStatus } from '@lifi/widget/src/stores/routes/types'
import { Box, Button, Chip, Slider, Typography } from '@mui/material'
import type { Meta, StoryObj } from '@storybook/react'
import {
  createMemoryHistory,
  createRootRoute,
  createRouter,
  RouterProvider,
} from '@tanstack/react-router'
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react'
import {
  type ExecutionStep,
  mockRoutes,
  pendingSteps,
  type TerminalKey,
  terminalKeys,
  terminalLabels,
  terminalSteps,
} from './transactionStatusCardFixtures'
import { useSequencePlayer } from './useSequencePlayer'

// ── Router setup ────────────────────────────────────────────────────────────
// TransactionDoneButtons / TransactionFailedButtons use `useNavigate` and
// `useRouter` — mount a minimal memory router so those hooks resolve. The
// live (route, status) from the animation controls is threaded into the
// router-rendered content via React context.

interface ExecutionState {
  route: RouteExtended
  status: RouteExecutionStatus
}

const ExecutionStateContext = createContext<ExecutionState | null>(null)

const noop = (): void => {}

function RoutedExecutionContent(): React.ReactElement | null {
  const state = useContext(ExecutionStateContext)
  if (!state) {
    return null
  }
  // Storybook-only wrapper that mirrors the PageContainer layout the
  // widget uses in production around the execution content.
  return (
    <PageContainer
      bottomGutters
      sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
    >
      <TransactionExecutionContent
        route={state.route}
        status={state.status}
        restartRoute={noop}
        deleteRoute={noop}
      />
    </PageContainer>
  )
}

const rootRoute = createRootRoute({ component: RoutedExecutionContent })
const router = createRouter({
  routeTree: rootRoute,
  history: createMemoryHistory({ initialEntries: ['/'] }),
})

// ── AutoPlay ────────────────────────────────────────────────────────────────

function AutoPlayDemo(): React.ReactElement {
  const [terminal, setTerminal] = useState<TerminalKey>('done')
  const [intervalMs, setIntervalMs] = useState(2500)

  const sequence: ExecutionStep[] = useMemo(
    () => [...pendingSteps, terminalSteps[terminal]],
    [terminal]
  )

  const player = useSequencePlayer({ sequence, intervalMs })
  const { routeKey, status } = player.current
  const route = mockRoutes[routeKey]

  const executionState = useMemo<ExecutionState>(
    () => ({ route, status }),
    [route, status]
  )

  const handleTerminalChange = useCallback(
    (key: TerminalKey) => {
      setTerminal(key)
      if (player.step >= pendingSteps.length) {
        player.setStep(pendingSteps.length)
      }
    },
    [player.step, player.setStep]
  )

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      <Box
        sx={{
          width: 220,
          flexShrink: 0,
          borderRight: 1,
          borderColor: 'divider',
          bgcolor: 'background.default',
          p: 2,
          display: 'flex',
          flexDirection: 'column',
          gap: 1.5,
        }}
      >
        <Box sx={{ display: 'flex', gap: 0.5 }}>
          <Button
            size="small"
            variant="outlined"
            onClick={player.goPrev}
            disabled={player.isFirst}
            sx={{ flex: 1, minWidth: 0 }}
          >
            Prev
          </Button>
          <Button
            size="small"
            variant="outlined"
            onClick={player.goNext}
            disabled={player.isLast}
            sx={{ flex: 1, minWidth: 0 }}
          >
            Next
          </Button>
        </Box>

        <Box sx={{ display: 'flex', gap: 0.5 }}>
          <Button
            size="small"
            variant={player.playing ? 'contained' : 'outlined'}
            onClick={player.togglePlay}
            disabled={player.isLast && !player.playing}
            sx={{ flex: 1, minWidth: 0 }}
          >
            {player.playing ? 'Pause' : 'Play'}
          </Button>
          <Button
            size="small"
            variant="outlined"
            onClick={player.reset}
            disabled={player.isFirst && !player.playing}
            sx={{ flex: 1, minWidth: 0 }}
          >
            Reset
          </Button>
        </Box>

        <Box>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ fontVariantNumeric: 'tabular-nums' }}
          >
            {player.step + 1}/{player.total}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {routeKey}
          </Typography>
        </Box>

        <Box>
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ mb: 0.5, display: 'block' }}
          >
            Landing state:
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
            {terminalKeys.map((key) => (
              <Chip
                key={key}
                label={terminalLabels[key]}
                size="small"
                variant={terminal === key ? 'filled' : 'outlined'}
                color={
                  key === 'done'
                    ? 'success'
                    : key === 'failed'
                      ? 'error'
                      : 'warning'
                }
                onClick={() => handleTerminalChange(key)}
                sx={{ cursor: 'pointer' }}
              />
            ))}
          </Box>
        </Box>

        <Box>
          <Typography variant="caption" color="text.secondary">
            Step interval: {intervalMs}ms
          </Typography>
          <Slider
            size="small"
            value={intervalMs}
            onChange={(_, v) => setIntervalMs(v as number)}
            min={500}
            max={8000}
            step={100}
          />
        </Box>
      </Box>

      <Box
        sx={{
          flex: 1,
          overflow: 'auto',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-start',
          gap: 4,
          p: 4,
        }}
      >
        <Box sx={{ width: '416px' }}>
          {/* Feature the execution content block — the card is one part of
              this composition alongside warning messages and the terminal
              button group. The RouterProvider's root component pulls the
              live (route, status) from context. */}
          <ExecutionStateContext.Provider value={executionState}>
            <RouterProvider router={router} />
          </ExecutionStateContext.Provider>
        </Box>
      </Box>
    </Box>
  )
}

// ── Meta + Stories ──────────────────────────────────────────────────────────

const meta = {
  title: 'Components/TransactionStatusCard',
  parameters: { layout: 'centered' },
} satisfies Meta

export default meta

export const AutoPlay: StoryObj<typeof meta> = {
  parameters: { layout: 'fullscreen' },
  render: () => <AutoPlayDemo />,
}

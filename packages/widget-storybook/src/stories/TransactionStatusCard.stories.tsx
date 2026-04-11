import { TransactionStatusCard } from '@lifi/widget/src/components/TransactionStatusCard/TransactionStatusCard'
import { ExecutionProgressCards } from '@lifi/widget/src/pages/TransactionPage/ExecutionProgressCards'
import type { RouteExecutionStatus } from '@lifi/widget/src/stores/routes/types'
import { Box, Button, Chip, Slider, Typography } from '@mui/material'
import type { Meta, StoryObj } from '@storybook/react'
import { useCallback, useMemo, useState } from 'react'
import {
  allStepEntries,
  type ExecutionStep,
  type MockRouteKey,
  mockRoutes,
  pendingSteps,
  type TerminalKey,
  terminalKeys,
  terminalLabels,
  terminalSteps,
} from './transactionStatusCardFixtures'
import { useSequencePlayer } from './useSequencePlayer'

// ── AutoPlay ────────────────────────────────────────────────────────────────

function AutoPlayDemo(): React.ReactElement {
  const [terminal, setTerminal] = useState<TerminalKey>('done')
  const [intervalMs, setIntervalMs] = useState(2500)
  const [timeScale, setTimeScale] = useState(1)

  const sequence: ExecutionStep[] = useMemo(
    () => [...pendingSteps, terminalSteps[terminal]],
    [terminal]
  )

  const player = useSequencePlayer({ sequence, intervalMs })
  const { routeKey, status } = player.current
  const route = mockRoutes[routeKey]

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

        <Box>
          <Typography variant="caption" color="text.secondary">
            Animation speed:{' '}
            {timeScale === 1 ? '1× (normal)' : `${timeScale}× (slow-mo)`}
          </Typography>
          <Slider
            size="small"
            value={timeScale}
            onChange={(_, v) => setTimeScale(v as number)}
            min={0.5}
            max={5}
            step={0.25}
            marks={[
              { value: 1, label: '1×' },
              { value: 3, label: '3×' },
              { value: 5, label: '5×' },
            ]}
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
        <Box sx={{ width: '368px' }}>
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ mb: 1, display: 'block' }}
          >
            TransactionStatusCard (new)
          </Typography>
          <TransactionStatusCard
            route={route}
            status={status}
            timeScale={timeScale}
          />
        </Box>
        <Box>
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ mb: 1, display: 'block' }}
          >
            ExecutionProgressCards (original)
          </Typography>
          <Box sx={{ width: 400 }}>
            <ExecutionProgressCards route={route} status={status} />
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

// ── Interactive ─────────────────────────────────────────────────────────────

function InteractiveDemo({
  routeKey,
  timeScale,
}: {
  routeKey: MockRouteKey
  timeScale: number
}): React.ReactElement {
  const entry =
    allStepEntries.find((e) => e.key === routeKey) ?? allStepEntries[0]
  const route = mockRoutes[entry.key]
  const status = entry.status as RouteExecutionStatus

  return (
    <TransactionStatusCard
      route={route}
      status={status}
      timeScale={timeScale}
    />
  )
}

// ── Meta + Stories ──────────────────────────────────────────────────────────

interface InteractiveArgs {
  routeKey: MockRouteKey
  timeScale: number
}

const meta = {
  title: 'Components/TransactionStatusCard',
  parameters: { layout: 'centered' },
} satisfies Meta

export default meta

export const AutoPlay: StoryObj<typeof meta> = {
  parameters: { layout: 'fullscreen' },
  render: () => <AutoPlayDemo />,
}

export const Interactive: StoryObj<Meta<InteractiveArgs>> = {
  argTypes: {
    routeKey: {
      control: 'select',
      options: allStepEntries.map((e) => e.key),
      description: 'Execution state',
    },
    timeScale: {
      control: { type: 'range', min: 0.5, max: 5, step: 0.25 },
      description: 'Animation speed multiplier',
    },
  },
  args: { routeKey: 'pendingAllowance', timeScale: 1 },
  render: (args) => (
    <InteractiveDemo routeKey={args.routeKey} timeScale={args.timeScale} />
  ),
}

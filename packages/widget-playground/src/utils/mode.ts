import type { ModeOptions, SplitMode, WidgetMode } from '@lifi/widget'

export type ModeOption = 'exchange' | 'split' | 'swap' | 'bridge' | 'refuel'

interface ModeOptionConfig {
  id: ModeOption
  title: string
  description: string
  mode: WidgetMode
  splitOption?: SplitMode
}

export const MODE_OPTIONS: ModeOptionConfig[] = [
  {
    id: 'exchange',
    title: 'Exchange',
    description:
      'Switch between flows automatically based on the selected assets and best route.',
    mode: 'default',
  },
  {
    id: 'split',
    title: 'Swap or Bridge',
    description:
      'Separate Swap and Bridge options so users choose the flow explicitly.',
    mode: 'split',
  },
  {
    id: 'swap',
    title: 'Swap',
    description: 'Pure swap experience, no bridging shown in this widget.',
    mode: 'split',
    splitOption: 'swap',
  },
  {
    id: 'bridge',
    title: 'Bridge',
    description:
      'Move funds between chains only. No swap functionality in this widget.',
    mode: 'split',
    splitOption: 'bridge',
  },
  {
    id: 'refuel',
    title: 'Refuel',
    description:
      'Dedicated gas-refuel flow that bridges a small amount of native token.',
    mode: 'refuel',
  },
]

/** Normalises modeOptions.split when stored as a plain string. */
export const getSplitOption = (
  modeOptions?: ModeOptions
): SplitMode | undefined => {
  const split = modeOptions?.split
  return typeof split === 'string' ? split : undefined
}

/** Maps widget mode and split option to the mode detail view selection id. */
export const getActiveMode = (
  mode: WidgetMode | 'default',
  splitOption?: SplitMode
): ModeOption =>
  MODE_OPTIONS.find(
    (option) => option.mode === mode && option.splitOption === splitOption
  )?.id ?? 'exchange'

export const getModeConfig = (mode: ModeOption): ModeOptionConfig => {
  const config = MODE_OPTIONS.find((option) => option.id === mode)
  if (!config) {
    return MODE_OPTIONS[0]
  }
  return config
}

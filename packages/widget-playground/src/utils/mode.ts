import type {
  SplitSubvariant,
  SubvariantOptions,
  WidgetSubvariant,
} from '@lifi/widget'

export type ModeOption = 'exchange' | 'split' | 'swap' | 'bridge' | 'refuel'

interface ModeOptionConfig {
  id: ModeOption
  title: string
  description: string
  subvariant: WidgetSubvariant
  splitOption?: SplitSubvariant
}

export const MODE_OPTIONS: ModeOptionConfig[] = [
  {
    id: 'exchange',
    title: 'Exchange',
    description:
      'Switch between flows automatically based on the selected assets and best route.',
    subvariant: 'default',
  },
  {
    id: 'split',
    title: 'Swap or Bridge',
    description:
      'Separate Swap and Bridge options so users choose the flow explicitly.',
    subvariant: 'split',
  },
  {
    id: 'swap',
    title: 'Swap',
    description: 'Pure swap experience, no bridging shown in this widget.',
    subvariant: 'split',
    splitOption: 'swap',
  },
  {
    id: 'bridge',
    title: 'Bridge',
    description:
      'Move funds between chains only. No swap functionality in this widget.',
    subvariant: 'split',
    splitOption: 'bridge',
  },
  {
    id: 'refuel',
    title: 'Refuel',
    description:
      'Dedicated gas-refuel flow that bridges a small amount of native token.',
    subvariant: 'refuel',
  },
]

export const getSplitOption = (
  subvariantOptions?: SubvariantOptions
): SplitSubvariant | undefined => {
  const split = subvariantOptions?.split
  return typeof split === 'string' ? split : undefined
}

export const getActiveMode = (
  subvariant: WidgetSubvariant | 'default',
  splitOption?: SplitSubvariant
): ModeOption =>
  MODE_OPTIONS.find(
    (option) =>
      option.subvariant === subvariant && option.splitOption === splitOption
  )?.id ?? 'exchange'

export const getModeConfig = (mode: ModeOption): ModeOptionConfig => {
  const config = MODE_OPTIONS.find((option) => option.id === mode)
  if (!config) {
    return MODE_OPTIONS[0]
  }
  return config
}

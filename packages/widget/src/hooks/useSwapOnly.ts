import { useSplitMode } from '../stores/navigationTabs/useNavigationTabsStore.js'

export const useSwapOnly = (): boolean => useSplitMode() === 'swap'

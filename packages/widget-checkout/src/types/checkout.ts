import type {
  Components,
  PaletteMode,
  PaletteOptions,
  Shape,
  Theme,
} from '@mui/material'
import type { TypographyVariantsOptions } from '@mui/material/styles'
import type {
  CSSProperties,
  PropsWithChildren,
  ReactNode,
  RefObject,
} from 'react'

export type Appearance = PaletteMode | 'system'

export interface NavigationProps {
  edge?: boolean
}

export type CheckoutThemeComponents = Partial<
  Pick<
    Components<Theme>,
    | 'MuiAppBar'
    | 'MuiAvatar'
    | 'MuiButton'
    | 'MuiCard'
    | 'MuiIconButton'
    | 'MuiInput'
  >
>

export interface CheckoutTheme {
  colorSchemes?: {
    light?: {
      palette: PaletteOptions
    }
    dark?: {
      palette: PaletteOptions
    }
  }
  shape?: Partial<Shape>
  typography?: TypographyVariantsOptions
  components?: CheckoutThemeComponents
  container?: CSSProperties
  header?: CSSProperties
  navigation?: NavigationProps
}

export interface FundingMethod {
  id: string
  name: string
  description?: string
  icon?: ReactNode
  provider: 'transak' | 'mesh' | 'custom'
}

export interface CheckoutConfig {
  integrator: string
  apiKey?: string

  appearance?: Appearance
  theme?: CheckoutTheme

  onSuccess?: (result: CheckoutResult) => void
  onError?: (error: CheckoutError) => void
  onClose?: () => void

  fundingMethods?: FundingMethod[]
}

export interface CheckoutResult {
  transactionHash?: string
  provider: string
  amount: string
  token: string
  chainId: number
}

export interface CheckoutError {
  code: string
  message: string
  provider?: string
}

export interface CheckoutDrawerRef {
  isOpen(): boolean
  open(): void
  close(): void
}

export interface CheckoutDrawerProps extends CheckoutConfigPartialProps {
  elementRef?: RefObject<HTMLDivElement | null>
  open?: boolean
  onClose?(): void
}

export interface CheckoutConfigProps {
  config: CheckoutConfig
}

export interface CheckoutConfigPartialProps {
  config?: Partial<CheckoutConfig>
}

export type CheckoutProps = CheckoutDrawerProps &
  CheckoutConfig &
  CheckoutConfigPartialProps

export interface CheckoutProviderProps extends PropsWithChildren {
  config: CheckoutConfig
}

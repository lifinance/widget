import type {
  FormRef,
  WidgetConfig,
  WidgetSDKConfig,
  WidgetWalletConfig,
} from '@lifi/widget'
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

/**
 * Configuration for checkout UI and providers.
 *
 * **Optional on-ramp peers** (`@transak/ui-js-sdk`, `@meshconnect/web-link-sdk`): the checkout
 * probes each at runtime before loading its adapter, so missing peers disable that provider without
 * executing its code. Bundlers may still need those packages resolvable when building async chunks;
 * install the peers (or mark them external per your toolchain) if the build fails to resolve them.
 */
export interface CheckoutConfig {
  integrator: string
  apiKey?: string

  /**
   * Base URL of the onramp session API (e.g. local mock: `http://localhost:8080`).
   * The client calls `POST {onrampSessionApiUrl}/v1/path/onramp-session` when the user starts a cash (Transak) deposit.
   * Required for **Deposit with Cash**; omit only if that entrypoint is unused.
   */
  onrampSessionApiUrl?: string

  appearance?: Appearance
  theme?: CheckoutTheme

  onSuccess?: (result: CheckoutResult) => void
  onError?: (error: CheckoutError) => void
  onClose?: () => void

  fundingMethods?: FundingMethod[]

  /**
   * Passed through to widget `WalletProvider` / SDK (same as LiFi widget).
   * When omitted entirely, checkout fills in the standard multi-chain provider stack
   * so wallet detection works (same idea as the playground defaults). Pass `[]` only
   * if you intentionally want no connector providers.
   */
  providers?: WidgetConfig['providers']
  walletConfig?: WidgetWalletConfig
  sdkConfig?: WidgetSDKConfig
  /**
   * Optional overrides merged into the derived `WidgetConfig` (integrator/apiKey/theme still come from checkout fields first).
   * For cash on-ramp, set `toChain` and `toToken` (contract address) here — they define the asset purchased via Transak and are locked in the UI.
   *
   * `languageResources` is deep-merged with checkout defaults (`tags.*` for wallet chips, `checkout.*` for checkout copy). Add keys under other locales the same way as the main widget.
   */
  widget?: Partial<WidgetConfig>
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

export interface CheckoutModalRef {
  isOpen(): boolean
  open(): void
  close(): void
}

export interface CheckoutModalProps extends CheckoutConfigPartialProps {
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

/**
 * Props for `<LifiWidgetCheckout />`.
 *
 * Configuration fields (integrator, apiKey, theme, etc.) can be set at the top level
 * **or** inside the `config` object. When both are provided, `config` takes precedence.
 *
 * Modal-only props (`open`, `elementRef`) are always top-level.
 */
export type CheckoutProps = CheckoutModalProps &
  CheckoutConfig &
  CheckoutConfigPartialProps & {
    formRef?: FormRef
  }
export interface CheckoutProviderProps extends PropsWithChildren {
  config: CheckoutConfig
}

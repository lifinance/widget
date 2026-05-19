declare global {
  interface ImportMetaEnv {
    readonly VITE_API_URL?: string
    readonly VITE_API_KEY?: string
    readonly VITE_TVM_WALLET_CONNECT?: string
    readonly VITE_CHECKOUT_API_BASE_URL?: string
    readonly VITE_CHECKOUT_INTEGRATOR?: string
    readonly VITE_CHECKOUT_TO_CHAIN?: string
    readonly VITE_CHECKOUT_TO_TOKEN?: string
    readonly VITE_ONRAMP_SESSION_API_URL?: string
  }

  interface ImportMeta {
    readonly env: ImportMetaEnv
  }
}

export {}

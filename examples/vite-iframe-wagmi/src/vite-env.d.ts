/// <reference types="vite/client" />

declare global {
  interface ImportMetaEnv {
    readonly VITE_WIDGET_URL: string
    readonly VITE_WALLET_CONNECT_PROJECT_ID?: string
  }

  interface ImportMeta {
    readonly env: ImportMetaEnv
  }
}

export {}

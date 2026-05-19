import examplesData from './examples.json'

export interface ExampleConfig {
  /** Playwright project name, CI matrix key, human label */
  name: string
  /** pnpm --filter value */
  pkg: string
  /** Server port */
  port: number
  /** 'build' = package.json build script; 'vite-build' = exec vite build (bypasses tsc) */
  buildCmd: 'build' | 'vite-build'
  /** pnpm script name to start the dev server (preview / start) */
  serveCmd: string
  /** Extra env vars for serve command (e.g. PORT for remix/react-router) */
  serveEnv?: Record<string, string>
  /** Test profile that covers this example */
  profile: 'standard' | 'routed' | 'iframe' | 'nft'
  /** URL path where the widget is mounted. Defaults to '/'. */
  mountPath: string
  status: 'active' | 'broken'
  brokenReason?: string
}

export const examples = examplesData as ExampleConfig[]
export const activeExamples = examples.filter((e) => e.status === 'active')

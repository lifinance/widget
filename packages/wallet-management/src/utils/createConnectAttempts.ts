export interface ConnectAttempt {
  start(): void
  isSuperseded(): boolean
}

export interface ConnectAttempts {
  create(): ConnectAttempt
}

// A user can leave a wallet's popup open and connect another wallet; only the newest
// attempt may close the menu or show its error.
export function createConnectAttempts(): ConnectAttempts {
  let latest = 0
  return {
    create() {
      let attempt: number | undefined
      return {
        start() {
          latest += 1
          attempt = latest
        },
        isSuperseded() {
          return attempt !== undefined && attempt !== latest
        },
      }
    },
  }
}

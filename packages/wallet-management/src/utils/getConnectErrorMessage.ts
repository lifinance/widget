const readText = (value: unknown): string | undefined => {
  if (typeof value !== 'string') {
    return undefined
  }
  const text = value.trim()
  return text || undefined
}

// Wallet SDKs reject with Errors, viem errors (whose message carries debug details)
// or plain objects such as the Stellar kit's { code, message }.
export function getConnectErrorMessage(error: unknown): string | undefined {
  if (typeof error === 'string') {
    return readText(error)
  }
  if (typeof error !== 'object' || error === null) {
    return undefined
  }
  const { shortMessage, message } = error as {
    shortMessage?: unknown
    message?: unknown
  }
  return readText(shortMessage) ?? readText(message)
}

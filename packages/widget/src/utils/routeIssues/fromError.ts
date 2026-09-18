import type { UnavailableRoutes } from '@lifi/sdk'

interface QuoteErrorBody {
  code?: number
  message?: string
  errors?: unknown
}

const isUnavailableRoutes = (value: unknown): value is UnavailableRoutes => {
  if (!value || typeof value !== 'object') {
    return false
  }
  const { filteredOut, failed } = value as Partial<UnavailableRoutes>
  const shaped =
    (filteredOut === undefined || Array.isArray(filteredOut)) &&
    (failed === undefined || Array.isArray(failed))
  // An entry is required, not just the shape: an empty `errors` explains
  // nothing, and accepting it would both stop the caller rethrowing and hide a
  // populated `message` behind it.
  return shaped && (filteredOut?.length ?? 0) + (failed?.length ?? 0) > 0
}

const fromParsed = (value: unknown): UnavailableRoutes | undefined => {
  if (isUnavailableRoutes(value)) {
    return value
  }
  const wrapped = (value as { errors?: unknown } | null)?.errors
  return isUnavailableRoutes(wrapped) ? wrapped : undefined
}

/**
 * The quote endpoints answer a no-route request with 404 and carry the same
 * diagnostics the routes endpoint returns in `unavailableRoutes`. Where they
 * sit is not settled: the field the API documents is `errors`, while QA saw
 * the develop backend serialise them into `message` instead. Read both, so the
 * card renders whichever shape arrives, and return nothing when neither does —
 * the caller must then rethrow and leave the error state its retry.
 */
export const unavailableRoutesFromError = (
  error: unknown
): UnavailableRoutes | undefined => {
  const body = (error as { cause?: { responseBody?: unknown } } | undefined)
    ?.cause?.responseBody
  if (!body || typeof body !== 'object') {
    return undefined
  }

  const { errors, message } = body as QuoteErrorBody
  const documented = fromParsed(errors)
  if (documented) {
    return documented
  }

  if (typeof message !== 'string') {
    return undefined
  }
  // The SDK appends the body message to the error message, so the payload can
  // trail prose rather than stand alone.
  const start = message.indexOf('{')
  if (start < 0) {
    return undefined
  }
  try {
    return fromParsed(JSON.parse(message.slice(start)))
  } catch {
    return undefined
  }
}

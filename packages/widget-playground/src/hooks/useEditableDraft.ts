import { useCallback, useEffect, useState } from 'react'

export const useEditableDraft = <T>(
  committedValue: T,
  toDraft: (value: T) => string,
  parseDraft: (draft: string) => T | null,
  onCommit: (value: T) => void
): {
  draft: string
  setDraft: (draft: string) => void
  commit: () => void
} => {
  const [draft, setDraft] = useState(() => toDraft(committedValue))

  useEffect(() => {
    setDraft(toDraft(committedValue))
  }, [committedValue, toDraft])

  const commit = useCallback((): void => {
    const parsed = parseDraft(draft)
    if (parsed !== null) {
      onCommit(parsed)
      setDraft(toDraft(parsed))
      return
    }
    setDraft(toDraft(committedValue))
  }, [committedValue, draft, onCommit, parseDraft, toDraft])

  return {
    draft,
    setDraft,
    commit,
  }
}

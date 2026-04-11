import { useCallback, useEffect, useRef, useState } from 'react'

interface SequencePlayerOptions<T> {
  sequence: T[]
  intervalMs: number
}

interface SequencePlayer<T> {
  current: T
  step: number
  total: number
  isFirst: boolean
  isLast: boolean
  playing: boolean
  goNext: () => void
  goPrev: () => void
  reset: () => void
  togglePlay: () => void
  setStep: (step: number) => void
}

export function useSequencePlayer<T>({
  sequence,
  intervalMs,
}: SequencePlayerOptions<T>): SequencePlayer<T> {
  const [step, setStep] = useState(0)
  const [playing, setPlaying] = useState(false)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const isFirst = step === 0
  const isLast = step === sequence.length - 1

  const goNext = useCallback(() => {
    setStep((s) => Math.min(s + 1, sequence.length - 1))
  }, [sequence.length])

  const goPrev = useCallback(() => {
    setStep((s) => Math.max(s - 1, 0))
  }, [])

  const reset = useCallback(() => {
    setPlaying(false)
    setStep(0)
  }, [])

  const togglePlay = useCallback(() => {
    setPlaying((prev) => !prev)
  }, [])

  useEffect(() => {
    if (!playing || isLast) {
      if (isLast && playing) {
        setPlaying(false)
      }
      return
    }
    timerRef.current = globalThis.setInterval(goNext, intervalMs)
    return () => {
      if (timerRef.current) {
        globalThis.clearInterval(timerRef.current)
        timerRef.current = null
      }
    }
  }, [playing, isLast, goNext, intervalMs])

  return {
    current: sequence[step],
    step,
    total: sequence.length,
    isFirst,
    isLast,
    playing,
    goNext,
    goPrev,
    reset,
    togglePlay,
    setStep,
  }
}

/** @vitest-environment happy-dom */

import { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { createFormStore } from '../stores/form/createFormStore.js'
import { FormStoreContext } from '../stores/form/FormStoreContext.js'
import type { FormFieldNames } from '../stores/form/types.js'
import { useDebouncedWatch } from './useDebouncedWatch.js'

// An immediate write used to be announced store-wide, so the reason card's
// Apply button told every mounted watcher that its own value had settled — and
// a watcher mid-keystroke on another field published that half-typed value a
// full debounce early.

const delay = 500

let store: ReturnType<typeof createFormStore>
let container: HTMLDivElement
let root: Root
const seen: Record<string, string[]> = {}

const Watcher = ({ field }: { field: FormFieldNames }): null => {
  const [value] = useDebouncedWatch(delay, field)
  seen[field] ??= []
  const published = seen[field]
  if (published.at(-1) !== value) {
    published.push(value as string)
  }
  return null
}

const render = (fields: FormFieldNames[]): void => {
  act(() => {
    root.render(
      <FormStoreContext value={store}>
        {fields.map((field) => (
          <Watcher key={field} field={field} />
        ))}
      </FormStoreContext>
    )
  })
}

beforeEach(() => {
  vi.useFakeTimers()
  store = createFormStore({ fromAmount: '', toAmount: '' } as never)
  for (const key of Object.keys(seen)) {
    delete seen[key]
  }
  container = document.createElement('div')
  document.body.appendChild(container)
  root = createRoot(container)
})

afterEach(() => {
  act(() => root.unmount())
  container.remove()
  vi.useRealTimers()
})

const write = (
  field: FormFieldNames,
  value: string,
  immediate?: boolean
): void => {
  act(() => {
    store.getState().setFieldValue(field, value, { isTouched: true, immediate })
  })
}

const wait = (ms: number): void => {
  act(() => {
    vi.advanceTimersByTime(ms)
  })
}

describe('a keystroke', () => {
  it('publishes only once the delay has passed', () => {
    render(['fromAmount'])
    write('fromAmount', '5')
    wait(delay - 1)
    expect(seen.fromAmount.at(-1)).toBe('')
    wait(1)
    expect(seen.fromAmount.at(-1)).toBe('5')
  })

  // Clearing the field has nothing left to type, and the quote it would keep
  // alive is for an amount the user just removed.
  it('publishes a cleared field at once', () => {
    render(['fromAmount'])
    write('fromAmount', '5')
    wait(delay)
    write('fromAmount', '')
    expect(seen.fromAmount.at(-1)).toBe('')
  })
})

describe('an immediate write', () => {
  it('flushes the watcher reading that field', () => {
    render(['fromAmount'])
    write('fromAmount', '5', true)
    expect(seen.fromAmount.at(-1)).toBe('5')
  })

  // The bump is consumed, or every keystroke after the card's button would
  // skip the delay too and send a quote per character.
  it('leaves the next keystroke debounced again', () => {
    render(['fromAmount'])
    write('fromAmount', '5', true)
    write('fromAmount', '55')
    wait(delay - 1)
    expect(seen.fromAmount.at(-1)).toBe('5')
    wait(1)
    expect(seen.fromAmount.at(-1)).toBe('55')
  })

  // The defect: a second watcher mid-edit on another field must keep waiting.
  it('leaves a watcher on another field still waiting', () => {
    render(['fromAmount', 'toAmount'])
    write('toAmount', '1.')
    write('fromAmount', '5', true)

    expect(seen.fromAmount.at(-1)).toBe('5')
    expect(seen.toAmount.at(-1)).toBe('')

    wait(delay)
    expect(seen.toAmount.at(-1)).toBe('1.')
  })
})

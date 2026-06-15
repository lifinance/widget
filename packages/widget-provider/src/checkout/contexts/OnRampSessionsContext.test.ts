import { describe, expect, it } from 'vitest'
import type { OnRampSession } from '../types.js'
import { createOnRampSessionsStore } from './OnRampSessionsContext.js'

const noop = () => {}

function makeSession(): OnRampSession {
  return {
    open: noop,
    close: noop,
    cancel: noop,
    isOpen: false,
    isLoading: false,
    error: null,
    failure: null,
    depositTxHash: null,
    acknowledgeDepositTxHash: noop,
    mountTargetId: null,
  }
}

describe('createOnRampSessionsStore', () => {
  it('registers a session under an id', () => {
    const store = createOnRampSessionsStore()
    const session = makeSession()
    store.getState().register('transak', session)
    expect(store.getState().sessions.transak).toBe(session)
  })

  it('is a no-op (same state reference) when re-registering the same session', () => {
    const store = createOnRampSessionsStore()
    const session = makeSession()
    store.getState().register('transak', session)
    const before = store.getState().sessions
    store.getState().register('transak', session)
    expect(store.getState().sessions).toBe(before)
  })

  it('replaces the slot when registering a different session for the same id', () => {
    const store = createOnRampSessionsStore()
    const first = makeSession()
    const second = makeSession()
    store.getState().register('transak', first)
    store.getState().register('transak', second)
    expect(store.getState().sessions.transak).toBe(second)
  })

  it('does not touch other slots when registering', () => {
    const store = createOnRampSessionsStore()
    const transak = makeSession()
    const mesh = makeSession()
    store.getState().register('transak', transak)
    store.getState().register('mesh', mesh)
    expect(store.getState().sessions.transak).toBe(transak)
    expect(store.getState().sessions.mesh).toBe(mesh)
  })

  it('removes a registered session on unregister', () => {
    const store = createOnRampSessionsStore()
    store.getState().register('transak', makeSession())
    store.getState().unregister('transak')
    expect(store.getState().sessions.transak).toBeUndefined()
  })

  it('is a no-op (same state reference) when unregistering an unknown id', () => {
    const store = createOnRampSessionsStore()
    store.getState().register('transak', makeSession())
    const before = store.getState().sessions
    store.getState().unregister('mesh')
    expect(store.getState().sessions).toBe(before)
  })
})

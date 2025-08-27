import { describe, it, expect } from 'vitest'
import { reducer, initialState } from '../reducer'
import { nowIso } from '../../lib/dates'

describe('reducer', () => {
  it('adds todos', () => {
    const state1 = reducer(initialState, { type: 'add', id: '1', title: 'a', now: nowIso() })
    expect(state1.todos).toHaveLength(1)
    expect(state1.todos[0].title).toBe('a')
  })
  it('toggles todo', () => {
    const now = nowIso()
    const s1 = reducer(initialState, { type: 'add', id: '1', title: 'a', now })
    const s2 = reducer(s1, { type: 'toggle', id: '1', now })
    expect(s2.todos[0].completed).toBe(true)
  })
  it('reorders', () => {
    const now = nowIso()
    let s = initialState
    s = reducer(s, { type: 'add', id: '1', title: 'a', now })
    s = reducer(s, { type: 'add', id: '2', title: 'b', now })
    s = reducer(s, { type: 'reorder', fromIndex: 0, toIndex: 1 })
    expect(s.todos[0].title).toBe('b')
    expect(s.todos[1].title).toBe('a')
  })
})

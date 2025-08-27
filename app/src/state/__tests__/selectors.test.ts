import { describe, it, expect } from 'vitest'
import { selectFiltered, selectCounts } from '../selectors'
import type { AppState } from '../types'

const base = (over?: Partial<AppState>): AppState => ({
  todos: [],
  filter: 'all',
  search: '',
  version: 1,
  ...over
})

describe('selectors', () => {
  it('filters by status and search', () => {
    const s = base({
      todos: [
        { id: '1', title: 'alpha', completed: false, order: 0, createdAt: '', updatedAt: '' },
        { id: '2', title: 'beta task', completed: true, order: 1, createdAt: '', updatedAt: '' }
      ],
      filter: 'active',
      search: 'alp'
    })
    const list = selectFiltered(s)
    expect(list.map((t) => t.id)).toEqual(['1'])
  })
  it('counts totals', () => {
    const s = base({
      todos: [
        { id: '1', title: 'a', completed: false, order: 0, createdAt: '', updatedAt: '' },
        { id: '2', title: 'b', completed: true, order: 1, createdAt: '', updatedAt: '' }
      ]
    })
    expect(selectCounts(s)).toEqual({ total: 2, active: 1, completed: 1 })
  })
})

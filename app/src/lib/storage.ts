import type { AppState, Todo } from '../state/types'

const KEY = 'todoapp:v1'

type Persisted = { version: 1; todos: Todo[]; filter: AppState['filter']; search: string }

export function load(): Persisted | null {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return null
    const data = JSON.parse(raw)
    if (typeof data.version !== 'number') {
      return { version: 1, todos: data.todos ?? [], filter: 'all', search: '' }
    }
    if (data.version === 1) {
      return data as Persisted
    }
    return { version: 1, todos: data.todos ?? [], filter: data.filter ?? 'all', search: data.search ?? '' }
  } catch {
    return null
  }
}

let saveTimer: number | undefined
export function saveDebounced(state: AppState, ms = 200) {
  window.clearTimeout(saveTimer)
  const payload: Persisted = {
    version: 1,
    todos: state.todos,
    filter: state.filter,
    search: state.search
  }
  saveTimer = window.setTimeout(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(payload))
    } catch {
      // ignore
    }
  }, ms)
}

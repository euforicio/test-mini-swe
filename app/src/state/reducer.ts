import type { AppState, Todo } from './types'
import type { Action } from './actions'
import { reorder } from '../lib/ordering'

export const initialState: AppState = {
  todos: [],
  filter: 'all',
  search: '',
  version: 1
}

export function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'hydrate':
      return { ...state, ...action.state }
    case 'add': {
      const order = state.todos.length === 0 ? 0 : Math.max(...state.todos.map((t) => t.order)) + 1
      const todo: Todo = {
        id: action.id,
        title: action.title.trim(),
        completed: false,
        order,
        createdAt: action.now,
        updatedAt: action.now
      }
      if (!todo.title) return state
      return { ...state, todos: [...state.todos, todo] }
    }
    case 'toggle': {
      return {
        ...state,
        todos: state.todos.map((t) =>
          t.id === action.id ? { ...t, completed: !t.completed, updatedAt: action.now } : t
        )
      }
    }
    case 'edit': {
      const title = action.title.trim()
      if (!title) return state
      return {
        ...state,
        todos: state.todos.map((t) => (t.id === action.id ? { ...t, title, updatedAt: action.now } : t))
      }
    }
    case 'remove': {
      return { ...state, todos: state.todos.filter((t) => t.id !== action.id) }
    }
    case 'clearCompleted': {
      return { ...state, todos: state.todos.filter((t) => !t.completed) }
    }
    case 'reorder': {
      const sorted = [...state.todos].sort((a, b) => a.order - b.order)
      const toIndex = Math.max(0, Math.min(sorted.length - 1, action.toIndex))
      const fromIndex = Math.max(0, Math.min(sorted.length - 1, action.fromIndex))
      const reordered = reorder(sorted, fromIndex, toIndex).map((t, idx) => ({
        ...t,
        order: idx
      }))
      return { ...state, todos: reordered }
    }
    case 'filter':
      return { ...state, filter: action.filter }
    case 'search':
      return { ...state, search: action.search }
    case 'import': {
      const normalized = action.todos
        .filter((t) => t.title && t.id)
        .map((t, idx) => ({ ...t, order: idx }))
      return { ...state, todos: normalized }
    }
    default:
      return state
  }
}

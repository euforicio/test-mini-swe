import React from 'react'
import { reducer, initialState } from '../state/reducer'
import type { AppState } from '../state/types'
import type { Action } from '../state/actions'
import { load, saveDebounced } from '../lib/storage'
import { createId } from '../lib/id'
import { nowIso } from '../lib/dates'

type Ctx = {
  state: AppState
  dispatch: React.Dispatch<Action>
  add: (title: string) => void
}

const TodoContext = React.createContext<Ctx | null>(null)

export const TodoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = React.useReducer(reducer, initialState)
  React.useEffect(() => {
    const persisted = load()
    if (persisted) {
      dispatch({ type: 'hydrate', state: { todos: persisted.todos, filter: persisted.filter, search: persisted.search } })
    }
  }, [])
  React.useEffect(() => {
    saveDebounced(state, 200)
  }, [state])

  const add = React.useCallback((title: string) => {
    dispatch({ type: 'add', title, id: createId(), now: nowIso() })
  }, [])

  const ctx: Ctx = { state, dispatch, add }
  return <TodoContext.Provider value={ctx}>{children}</TodoContext.Provider>
}

export const useTodos = () => {
  const ctx = React.useContext(TodoContext)
  if (!ctx) throw new Error('useTodos must be used within TodoProvider')
  return ctx
}

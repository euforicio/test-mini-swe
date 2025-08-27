import type { AppState, Todo } from './types'

export const selectTodosSorted = (s: AppState): Todo[] =>
  [...s.todos].sort((a, b) => a.order - b.order)

export const selectFiltered = (s: AppState): Todo[] => {
  const list = selectTodosSorted(s)
  const search = s.search.trim().toLowerCase()
  return list.filter((t) => {
    if (s.filter === 'active' && t.completed) return false
    if (s.filter === 'completed' && !t.completed) return false
    if (search && !t.title.toLowerCase().includes(search)) return false
    return true
  })
}

export const selectCounts = (s: AppState) => {
  const total = s.todos.length
  const completed = s.todos.filter((t) => t.completed).length
  const active = total - completed
  return { total, active, completed }
}

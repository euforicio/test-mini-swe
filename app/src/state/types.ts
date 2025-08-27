export type Todo = {
  id: string
  title: string
  completed: boolean
  order: number
  createdAt: string
  updatedAt: string
}

export type Filter = 'all' | 'active' | 'completed'

export type AppState = {
  todos: Todo[]
  filter: Filter
  search: string
  version: 1
}

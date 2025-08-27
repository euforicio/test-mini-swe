import type { Todo, Filter } from './types'

export type Action =
  | { type: 'add'; title: string; id: string; now: string }
  | { type: 'toggle'; id: string; now: string }
  | { type: 'edit'; id: string; title: string; now: string }
  | { type: 'remove'; id: string }
  | { type: 'clearCompleted' }
  | { type: 'reorder'; fromIndex: number; toIndex: number }
  | { type: 'filter'; filter: Filter }
  | { type: 'search'; search: string }
  | { type: 'hydrate'; state: { todos: Todo[]; filter: Filter; search: string } }
  | { type: 'import'; todos: Todo[] }

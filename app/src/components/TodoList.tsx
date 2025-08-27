import React from 'react'
import { useTodos } from '../context/TodoContext'
import { selectFiltered, selectTodosSorted } from '../state/selectors'
import { TodoItem } from './TodoItem'

export const TodoList: React.FC = () => {
  const { state } = useTodos()
  const list = selectFiltered(state)
  const sortedAll = selectTodosSorted(state)
  const getIndex = (id: string) => sortedAll.findIndex((t) => t.id === id)

  return (
    <div className="mt-2">
      <ul role="list" aria-label="Todos" className="space-y-1">
        {list.map((t) => (
          <TodoItem key={t.id} id={t.id} title={t.title} completed={t.completed} index={getIndex(t.id)} />
        ))}
      </ul>
      {list.length === 0 && (
        <p className="text-sm text-gray-600 mt-4" role="status">
          No todos match the current filter.
        </p>
      )}
    </div>
  )
}

import React from 'react'
import { useTodos } from '../context/TodoContext'
import { selectCounts } from '../state/selectors'

export const StatsBar: React.FC = () => {
  const { state, dispatch } = useTodos()
  const { total, active, completed } = selectCounts(state)
  return (
    <div className="mt-4 flex items-center gap-3 text-sm">
      <span aria-live="polite">
        Total: {total} • Active: {active} • Completed: {completed}
      </span>
      <div className="flex-1" />
      <button
        className="px-2 py-1 rounded border"
        onClick={() => dispatch({ type: 'clearCompleted' })}
      >
        Clear completed
      </button>
    </div>
  )
}

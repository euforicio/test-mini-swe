import React from 'react'
import { useTodos } from '../context/TodoContext'
import { nowIso } from '../lib/dates'

export const TodoItem: React.FC<{
  id: string
  index: number
  title: string
  completed: boolean
}> = ({ id, index, title, completed }) => {
  const { dispatch } = useTodos()
  const [editing, setEditing] = React.useState(false)
  const [value, setValue] = React.useState(title)
  const ref = React.useRef<HTMLLIElement | null>(null)

  React.useEffect(() => setValue(title), [title])

  const onSubmitEdit = () => {
    const v = value.trim()
    if (v && v !== title) {
      dispatch({ type: 'edit', id, title: v, now: nowIso() })
    }
    setEditing(false)
  }

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === ' ' && !editing) {
      e.preventDefault()
      dispatch({ type: 'toggle', id, now: nowIso() })
    }
    if (e.key.toLowerCase() === 'e' && !editing) {
      e.preventDefault()
      setEditing(true)
    }
    if (e.altKey && e.key === 'ArrowUp') {
      e.preventDefault()
      if (index > 0) dispatch({ type: 'reorder', fromIndex: index, toIndex: index - 1 })
      ref.current?.focus()
    }
    if (e.altKey && e.key === 'ArrowDown') {
      e.preventDefault()
      dispatch({ type: 'reorder', fromIndex: index, toIndex: index + 1 })
      ref.current?.focus()
    }
    if (editing && e.key === 'Enter') {
      e.preventDefault()
      onSubmitEdit()
    }
    if (editing && e.key === 'Escape') {
      setEditing(false)
      setValue(title)
    }
  }

  const onDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('text/plain', String(index))
    e.dataTransfer.effectAllowed = 'move'
  }
  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }
  const onDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const from = Number(e.dataTransfer.getData('text/plain'))
    const to = index
    if (!Number.isNaN(from) && from !== to) {
      dispatch({ type: 'reorder', fromIndex: from, toIndex: to })
    }
  }

  return (
    <li
      ref={ref}
      role="listitem"
      tabIndex={0}
      id={`todo-${id}`}
      className="flex items-center gap-2 px-2 py-1 rounded hover:bg-gray-50"
      draggable
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDrop={onDrop}
      onKeyDown={onKeyDown}
      aria-checked={completed}
    >
      <input
        type="checkbox"
        aria-label={`Mark "${title}" as ${completed ? 'active' : 'completed'}`}
        checked={completed}
        onChange={() => dispatch({ type: 'toggle', id, now: nowIso() })}
      />
      {editing ? (
        <input
          className="flex-1 border rounded px-2 py-1 text-sm"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          autoFocus
          onBlur={onSubmitEdit}
          aria-label="Edit task title"
        />
      ) : (
        <span className={'flex-1 ' + (completed ? 'line-through text-gray-500' : '')}>{title}</span>
      )}
      <div className="flex gap-1">
        <button className="text-sm px-2 py-1 rounded border" onClick={() => setEditing((v) => !v)} aria-label="Edit">
          E
        </button>
        <button className="text-sm px-2 py-1 rounded border" onClick={() => dispatch({ type: 'remove', id })} aria-label="Delete">
          ×
        </button>
      </div>
    </li>
  )
}

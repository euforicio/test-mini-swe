import React from 'react'
import { useTodos } from '../context/TodoContext'

export const AddTask: React.FC<{ inputRef?: React.RefObject<HTMLInputElement> }> = ({ inputRef }) => {
  const { add } = useTodos()
  const [title, setTitle] = React.useState('')
  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return
    add(title)
    setTitle('')
  }
  return (
    <form onSubmit={onSubmit} className="mt-4 mb-2 flex gap-2" aria-label="Add task">
      <label className="sr-only" htmlFor="new-task">New task</label>
      <input
        id="new-task"
        ref={inputRef}
        className="flex-1 border rounded px-3 py-2"
        placeholder="Add a task…"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        aria-label="New task"
      />
      <button type="submit" className="px-3 py-2 rounded bg-blue-600 text-white hover:bg-blue-700">
        Add
      </button>
    </form>
  )
}

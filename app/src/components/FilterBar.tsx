import React from 'react'
import { useTodos } from '../context/TodoContext'
import type { Filter } from '../state/types'
import { z } from 'zod'
import { useToast } from './Toast'

const ImportSchema = z
  .object({
    todos: z.array(z.any()).optional(),
    filter: z.enum(['all', 'active', 'completed']).optional(),
    search: z.string().optional()
  })
  .passthrough()

export const FilterBar: React.FC<{
  searchRef?: React.RefObject<HTMLInputElement>
  onToast?: (t: { message: string; variant?: 'info' | 'success' | 'error' }) => void
}> = ({ searchRef, onToast }) => {
  const { state, dispatch } = useTodos()
  const { push } = useToast()
  const toast = onToast ?? push

  const setFilter = (f: Filter) => dispatch({ type: 'filter', filter: f })
  const onSearch = (e: React.ChangeEvent<HTMLInputElement>) =>
    dispatch({ type: 'search', search: e.target.value })

  const onExport = () => {
    const payload = JSON.stringify(
      { version: 1, todos: state.todos, filter: state.filter, search: state.search },
      null,
      2
    )
    const blob = new Blob([payload], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'todo-export.json'
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
    toast({ message: 'Exported JSON', variant: 'success' })
  }

  const fileRef = React.useRef<HTMLInputElement | null>(null)
  const onImportClick = () => fileRef.current?.click()
  const onImportFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    try {
      const text = await file.text()
      const json = JSON.parse(text)
      const parsed = ImportSchema.safeParse(json)
      if (!parsed.success) {
        toast({ message: 'Invalid file', variant: 'error' })
        return
      }
      const rawTodos = Array.isArray(parsed.data.todos) ? parsed.data.todos : []
      let skipped = 0
      const todos = rawTodos
        .map((t: any, idx: number) => {
          if (!t || typeof t !== 'object') {
            skipped++
            return null
          }
          const id = typeof t.id === 'string' ? t.id : null
          const title = typeof t.title === 'string' ? t.title : null
          if (!id || !title) {
            skipped++
            return null
          }
          return {
            id,
            title,
            completed: !!t.completed,
            order: typeof t.order === 'number' ? t.order : idx,
            createdAt: typeof t.createdAt === 'string' ? t.createdAt : new Date().toISOString(),
            updatedAt: typeof t.updatedAt === 'string' ? t.updatedAt : new Date().toISOString()
          }
        })
        .filter(Boolean) as any[]
      dispatch({ type: 'import', todos })
      toast({
        message: `Imported ${todos.length} todos${skipped ? ` (skipped ${skipped} invalid)` : ''}`,
        variant: 'success'
      })
    } catch {
      toast({ message: 'Import failed', variant: 'error' })
    }
  }

  return (
    <div className="flex flex-col md:flex-row md:items-center gap-3">
      <div role="group" aria-label="Filter" className="inline-flex rounded border overflow-hidden">
        {(['all', 'active', 'completed'] as Filter[]).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={
              'px-3 py-1 text-sm ' +
              (state.filter === f ? 'bg-blue-600 text-white' : 'bg-white hover:bg-gray-100')
            }
            aria-pressed={state.filter === f}
          >
            {f[0].toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>
      <div className="flex-1" />
      <input
        ref={searchRef}
        className="border rounded px-3 py-1 text-sm"
        placeholder="Search…"
        aria-label="Search"
        value={state.search}
        onChange={onSearch}
      />
      <div className="flex gap-2">
        <button onClick={onExport} className="px-3 py-1 text-sm rounded border">
          Export JSON
        </button>
        <button onClick={onImportClick} className="px-3 py-1 text-sm rounded border">
          Import JSON
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="application/json"
          className="hidden"
          onChange={onImportFile}
          aria-hidden="true"
          tabIndex={-1}
        />
      </div>
    </div>
  )
}

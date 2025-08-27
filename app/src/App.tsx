import React from 'react'
import { TodoProvider } from './context/TodoContext'
import { AddTask } from './components/AddTask'
import { FilterBar } from './components/FilterBar'
import { StatsBar } from './components/StatsBar'
import { TodoList } from './components/TodoList'
import { ToastProvider, useToast } from './components/Toast'
import { Modal } from './components/Modal'

export const AppInner: React.FC = () => {
  const [showHelp, setShowHelp] = React.useState(false)
  const { push } = useToast()
  const searchRef = React.useRef<HTMLInputElement | null>(null)
  const newRef = React.useRef<HTMLInputElement | null>(null)

  React.useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName
      const isTyping = tag === 'INPUT' || tag === 'TEXTAREA' || (e.target as HTMLElement)?.isContentEditable
      if (!isTyping && (e.key === '/' || e.key === 'N' || e.key === '?' )) {
        e.preventDefault()
      }
      if (e.key === '?' && !isTyping) setShowHelp((s) => !s)
      if (e.key === '/' && !isTyping) searchRef.current?.focus()
      if ((e.key === 'N' || e.key === 'n') && !isTyping) newRef.current?.focus()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  return (
    <div className="min-h-screen p-4 md:p-8 max-w-3xl mx-auto">
      <header className="mb-4">
        <h1 className="text-2xl font-semibold">Todo App</h1>
        <p className="text-sm text-gray-600">Client-only. Keyboard: N (new), / (search), ? (help).</p>
      </header>
      <FilterBar searchRef={searchRef} onToast={push} />
      <AddTask inputRef={newRef} />
      <TodoList />
      <StatsBar />
      <Modal open={showHelp} onClose={() => setShowHelp(false)} ariaLabel="Help">
        <div className="space-y-2">
          <h2 className="text-lg font-semibold">Keyboard shortcuts</h2>
          <ul className="list-disc list-inside text-sm">
            <li>N: focus New Task</li>
            <li>/: focus Search</li>
            <li>Space: toggle focused item</li>
            <li>E: edit focused item</li>
            <li>Alt+ArrowUp/Down: reorder focused item</li>
            <li>?: toggle this help</li>
          </ul>
        </div>
      </Modal>
    </div>
  )
}

export const App: React.FC = () => {
  return (
    <ToastProvider>
      <TodoProvider>
        <AppInner />
      </TodoProvider>
    </ToastProvider>
  )
}

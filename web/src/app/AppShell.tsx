import { useReducer, useState } from "react";
import { reducer, initialState, type Action } from "../state/reducer";
import "../styles/tailwind.css";
export function AppShell(){
  const [state, dispatch] = useReducer(reducer, initialState);
  const [toast, setToast] = useState<string|null>(null);
  return (
    <div id="app" className="min-h-screen container mx-auto max-w-3xl px-4 py-6">
      <h1 className="text-2xl font-semibold mb-3">Simple Todo</h1>
      <form className="flex gap-2 mb-4" onSubmit={(e)=>{ e.preventDefault(); const input = (e.currentTarget.elements.namedItem("title") as HTMLInputElement); const v = input.value.trim(); if(!v) return; dispatch({type:"ADD_TODO", title:v}); input.value=""; }}>
        <label htmlFor="title" className="sr-only">Add a task</label>
        <input id="title" name="title" className="flex-1 border rounded px-3 py-2" placeholder="What needs to be done?" />
        <button className="px-3 py-2 rounded bg-indigo-600 text-white" type="submit">Add</button>
      </form>
      <ul role="list">
        {state.todos.map((t)=>(
          <li key={t.id} className="flex items-center gap-2 border rounded px-3 py-2 mb-2">
            <input aria-label="Mark complete" type="checkbox" checked={t.done} onChange={()=>dispatch({type:"TOGGLE_TODO", id:t.id})} />
            <span className={"flex-1 "+(t.done?"line-through opacity-60":"")}>{t.title}</span>
            <button className="px-2 py-1 rounded border" onClick={()=>{ dispatch({type:"DELETE_TODO", id:t.id}); setToast("Task deleted. Undo?"); }}>Delete</button>
          </li>
        ))}
      </ul>
      {state.todos.length===0 && <p className="opacity-70 mt-6">Nothing here yet. Add your first task!</p>}
      {toast && (
        <div role="status" aria-live="polite" className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-slate-800 text-white rounded px-3 py-2">
          <span>{toast}</span>
          <button className="ml-3 underline" onClick={()=>{ dispatch({type:"UNDO_DELETE"} as Action); setToast(null); }}>Undo</button>
          <button className="ml-3 opacity-80" onClick={()=>setToast(null)} aria-label="Close">✕</button>
        </div>
      )}
    </div>
  );
}

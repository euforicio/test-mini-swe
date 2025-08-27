import type { AppState, Todo } from "./types";
export const initialState: AppState = { version: 1, todos: [], tags: [], filters: { status: "all", due: "all", tags: [], sortBy: "custom" }, search: "", trash: [] };
type Action = { type: "ADD_TODO"; title: string } | { type: "TOGGLE_TODO"; id: string } | { type: "DELETE_TODO"; id: string } | { type: "UNDO_DELETE" };
export type { Action };
const id = () => Math.random().toString(36).slice(2);
export function reducer(state: AppState, action: Action): AppState {
  switch(action.type){
    case "ADD_TODO": {
      const t: Todo = { id: id(), title: action.title.trim(), notes: "", done: false, tags: [], createdAt: new Date().toISOString(), priority: 0, order: (state.todos.length+1).toString(36) };
      return { ...state, todos: [...state.todos, t] };
    }
    case "TOGGLE_TODO": return { ...state, todos: state.todos.map(t => t.id===action.id?{...t,done:!t.done}:t) };
    case "DELETE_TODO": {
      const removed = state.todos.find(t=>t.id===action.id);
      return { ...state, todos: state.todos.filter(t=>t.id!==action.id), trash: removed?[removed]:[] };
    }
    case "UNDO_DELETE": {
      if(!state.trash?.length) return state;
      return { ...state, todos: [...state.todos, state.trash[0]], trash: [] };
    }
    default: return state;
  }
}

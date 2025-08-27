/* Super Simple Todo - Vanilla JS, no build. */
(() => {
  'use strict';

  const STORAGE_KEY = 'ss-todos-v1';

  /** @typedef {{id:string,text:string,completed:boolean,createdAt:number}} Todo */

  /** @type {{ todos: Todo[], currentFilter: 'all'|'active'|'completed' }} */
  const state = {
    todos: [],
    currentFilter: 'all'
  };

  // Elements
  const $form = () => document.getElementById('todo-form');
  const $input = () => document.getElementById('new-todo');
  const $list = () => document.getElementById('todo-list');
  const $itemsLeft = () => document.getElementById('items-left');
  const $clearCompleted = () => document.getElementById('clear-completed');
  const $filterBtns = () => Array.from(document.querySelectorAll('.filter'));

  function uuid() {
    try {
      if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID();
    } catch (_) { /* ignore */ }
    // Fallback: not RFC4122 but good enough as unique id for client app
    return (Date.now().toString(36) + Math.random().toString(36).slice(2));
  }

  function escapeHTML(s) {
    return s.replace(/[&<>"']/g, (c) => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[c]));
  }

  function loadFromStorage() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return [];
      const data = JSON.parse(raw);
      if (!Array.isArray(data)) return [];
      // Basic shape validation
      return data
        .filter(t => t && typeof t === 'object')
        .map(t => ({
          id: String(t.id || uuid()),
          text: String(t.text || '').trim(),
          completed: Boolean(t.completed),
          createdAt: Number.isFinite(t.createdAt) ? Number(t.createdAt) : Date.now()
        }));
    } catch (e) {
      console.warn('Failed to parse storage; starting fresh.', e);
      return [];
    }
  }

  function persist() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.todos));
    } catch (e) {
      console.warn('Persist failed:', e);
    }
  }

  function filteredTodos() {
    switch (state.currentFilter) {
      case 'active': return state.todos.filter(t => !t.completed);
      case 'completed': return state.todos.filter(t => t.completed);
      default: return state.todos.slice();
    }
  }

  function render() {
    // List
    const items = filteredTodos()
      .sort((a, b) => a.createdAt - b.createdAt)
      .map(t => {
        const checkboxId = `todo-${t.id}`;
        return `
<li class="todo-item${t.completed ? ' completed' : ''}" data-id="${t.id}">
  <input class="toggle" id="${checkboxId}" type="checkbox" ${t.completed ? 'checked' : ''} aria-label="Mark '${escapeHTML(t.text)}' as ${t.completed ? 'incomplete' : 'complete'}">
  <label class="text" for="${checkboxId}">${escapeHTML(t.text)}</label>
  <button class="destroy" type="button" data-action="delete" aria-label="Delete '${escapeHTML(t.text)}'">✕</button>
</li>`;
      })
      .join('');
    $list().innerHTML = items;

    // Items left
    const left = state.todos.filter(t => !t.completed).length;
    $itemsLeft().textContent = `${left} ${left === 1 ? 'item' : 'items'} left`;

    // Filter button selected state
    $filterBtns().forEach(btn => {
      const on = btn.dataset.filter === state.currentFilter;
      btn.classList.toggle('selected', on);
      btn.setAttribute('aria-pressed', String(on));
    });

    // Clear completed button
    const hasCompleted = state.todos.some(t => t.completed);
    $clearCompleted().disabled = !hasCompleted;
  }

  function addTodo(text) {
    const trimmed = String(text || '').trim();
    if (!trimmed) return; // ignore empty/whitespace-only adds
    state.todos.push({
      id: uuid(),
      text: trimmed,
      completed: false,
      createdAt: Date.now()
    });
    persist();
    render();
  }

  function toggleTodo(id) {
    const t = state.todos.find(x => x.id === id);
    if (!t) return;
    t.completed = !t.completed;
    persist();
    render();
  }

  function deleteTodo(id) {
    const before = state.todos.length;
    state.todos = state.todos.filter(t => t.id !== id);
    if (state.todos.length !== before) {
      persist();
      render();
    }
  }

  function clearCompleted() {
    const before = state.todos.length;
    state.todos = state.todos.filter(t => !t.completed);
    if (state.todos.length !== before) {
      persist();
      render();
    }
  }

  function setFilter(filter) {
    if (!['all', 'active', 'completed'].includes(filter)) return;
    state.currentFilter = filter;
    render();
  }

  function init() {
    state.todos = loadFromStorage();
    // Events
    $form().addEventListener('submit', (e) => {
      e.preventDefault();
      addTodo($input().value);
      $input().value = '';
      $input().focus();
    });

    $list().addEventListener('change', (e) => {
      const target = e.target;
      if (target && target.classList.contains('toggle')) {
        const li = target.closest('.todo-item');
        if (li) toggleTodo(li.dataset.id);
      }
    });

    $list().addEventListener('click', (e) => {
      const btn = e.target;
      if (btn && btn.dataset && btn.dataset.action === 'delete') {
        const li = btn.closest('.todo-item');
        if (li) deleteTodo(li.dataset.id);
      }
    });

    document.addEventListener('click', (e) => {
      const btn = e.target;
      if (!(btn instanceof HTMLElement)) return;
      if (btn.classList.contains('filter') && btn.dataset.filter) {
        setFilter(btn.dataset.filter);
      }
    });

    $clearCompleted().addEventListener('click', () => clearCompleted());

    render();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();

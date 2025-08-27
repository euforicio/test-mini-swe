(function(){
  const T = (window.TodoApp = window.TodoApp || {});
  const Storage = T.Storage;

  const DEFAULT_STATE = Object.freeze({
    tasks: [],
    filter: 'all',
    search: '',
    version: 1
  });

  let state = { ...DEFAULT_STATE };

  function now() { return Date.now(); }

  function uuid() {
    if (window.crypto && crypto.randomUUID) return crypto.randomUUID();
    // fallback
    return `${now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
  }

  function getState() {
    // Return a deep-ish clone to avoid external mutation
    return {
      tasks: state.tasks.map(t => ({...t})),
      filter: state.filter,
      search: state.search,
      version: state.version
    };
  }

  function init(loaded) {
    if (loaded && loaded.version === 1) {
      state = {
        tasks: Array.isArray(loaded.tasks) ? loaded.tasks.map(t => ({...t})) : [],
        filter: loaded.filter || 'all',
        search: loaded.search || '',
        version: 1
      };
    } else {
      state = { ...DEFAULT_STATE };
    }
    Storage.scheduleSave(getState());
  }

  function addTask(title) {
    const clean = String(title || '').trim();
    if (!clean) return null;
    const task = {
      id: uuid(),
      title: clean,
      completed: false,
      createdAt: now(),
      updatedAt: now()
    };
    state.tasks.unshift(task);
    Storage.scheduleSave(getState());
    return task;
  }

  function toggleComplete(id) {
    const t = state.tasks.find(x => x.id === id);
    if (!t) return;
    t.completed = !t.completed;
    t.updatedAt = now();
    Storage.scheduleSave(getState());
  }

  function deleteTask(id) {
    const idx = state.tasks.findIndex(x => x.id === id);
    if (idx >= 0) {
      state.tasks.splice(idx, 1);
      Storage.scheduleSave(getState());
      return true;
    }
    return false;
  }

  function updateTitle(id, title) {
    const clean = String(title || '').trim();
    if (!clean) return false;
    const t = state.tasks.find(x => x.id === id);
    if (!t) return false;
    if (t.title === clean) return true;
    t.title = clean;
    t.updatedAt = now();
    Storage.scheduleSave(getState());
    return true;
  }

  function clearCompleted() {
    const before = state.tasks.length;
    state.tasks = state.tasks.filter(t => !t.completed);
    const removed = before - state.tasks.length;
    if (removed > 0) Storage.scheduleSave(getState());
    return removed;
  }

  function setFilter(filter) {
    if (!['all','active','completed'].includes(filter)) return;
    state.filter = filter;
    Storage.scheduleSave(getState());
  }

  function setSearch(q) {
    state.search = String(q || '');
    // No immediate save required for transient search, but keep for persistence
    Storage.scheduleSave(getState());
  }

  function counts() {
    const total = state.tasks.length;
    const completed = state.tasks.filter(t => t.completed).length;
    const active = total - completed;
    return { total, active, completed };
  }

  function filteredTasks() {
    const search = (state.search || '').toLowerCase().trim();
    let tasks = state.tasks;
    if (state.filter === 'active') tasks = tasks.filter(t => !t.completed);
    else if (state.filter === 'completed') tasks = tasks.filter(t => t.completed);
    if (search) tasks = tasks.filter(t => t.title.toLowerCase().includes(search));
    return tasks;
  }

  T.State = {
    init,
    getState,
    addTask,
    toggleComplete,
    deleteTask,
    updateTitle,
    clearCompleted,
    setFilter,
    setSearch,
    counts,
    filteredTasks
  };
})();

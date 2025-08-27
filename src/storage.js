(function(){
  const T = (window.TodoApp = window.TodoApp || {});
  const KEY = 'todoapp:v1';
  let pendingTimer = null;
  let lastState = null;

  function safeParse(json) {
    try {
      const data = JSON.parse(json);
      if (!data || typeof data !== 'object') return null;
      if (!Array.isArray(data.tasks)) return null;
      if (typeof data.version !== 'number') return null;
      if (!['all','active','completed'].includes(data.filter || 'all')) data.filter = 'all';
      data.search = typeof data.search === 'string' ? data.search : '';
      data.version = 1;
      // Normalize tasks
      data.tasks = data.tasks.filter(t => t && typeof t.title === 'string').map(t => ({
        id: String(t.id ? t.id : (((window.crypto id: String(t.id || crypto.randomUUID ? crypto.randomUUID() : (Date.now().toString(36)+Math.random().toString(36).slice(2)) ),id: String(t.id || crypto.randomUUID ? crypto.randomUUID() : (Date.now().toString(36)+Math.random().toString(36).slice(2)) ), crypto.randomUUID) ? crypto.randomUUID() : (Date.now().toString(36)+Math.random().toString(36).slice(2))))),
        title: String(t.title).trim(),
        completed: !!t.completed,
        createdAt: typeof t.createdAt === 'number' ? t.createdAt : Date.now(),
        updatedAt: typeof t.updatedAt === 'number' ? t.updatedAt : Date.now(),
      }));
      return data;
    } catch {
      return null;
    }
  }

  function load() {
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) return null;
      return safeParse(raw);
    } catch {
      return null;
    }
  }

  function saveNow(state) {
    try {
      localStorage.setItem(KEY, JSON.stringify(state));
    } catch {
      // ignore quota or access errors
    }
  }

  function scheduleSave(state) {
    lastState = state;
    if (pendingTimer) {
      clearTimeout(pendingTimer);
    }
    pendingTimer = setTimeout(() => {
      pendingTimer = null;
      if (lastState) saveNow(lastState);
    }, 200); // throttle/debounce writes
  }

  T.Storage = { KEY, load, scheduleSave, saveNow };
})();

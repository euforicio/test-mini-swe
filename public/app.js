const state = {
  filter: 'all',
  todos: []
};

const listEl = document.getElementById('todo-list');
const formEl = document.getElementById('todo-form');
const titleEl = document.getElementById('title');
const descEl = document.getElementById('description');
const filterButtons = document.querySelectorAll('.btn.filter');

filterButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    filterButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    state.filter = btn.dataset.filter;
    refresh();
  });
});

formEl.addEventListener('submit', async (e) => {
  e.preventDefault();
  const title = titleEl.value.trim();
  const description = descEl.value;
  if (!title) return;
  try {
    await createTodo({ title, description });
    titleEl.value = '';
    descEl.value = '';
    await refresh();
  } catch (err) {
    alert('Failed to create todo: ' + (err.message || err));
  }
});

async function fetchJSON(url, options) {
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
    ...options
  });
  if (!res.ok) {
    let msg = res.statusText;
    try {
      const data = await res.json();
      msg = data.error || (data.errors && data.errors.join(', ')) || msg;
    } catch (_) {}
    throw new Error(msg);
  }
  return res.json().catch(() => ({}));
}

async function getTodos(filter='all') {
  return fetchJSON(`/api/todos?filter=${encodeURIComponent(filter)}`);
}

async function createTodo(todo) {
  return fetchJSON('/api/todos', { method: 'POST', body: JSON.stringify(todo) });
}

async function updateTodo(id, patch) {
  return fetchJSON(`/api/todos/${id}`, { method: 'PUT', body: JSON.stringify(patch) });
}

async function deleteTodo(id) {
  const res = await fetch(`/api/todos/${id}`, { method: 'DELETE' });
  if (!res.ok) {
    let msg = res.statusText;
    try { const data = await res.json(); msg = data.error || msg; } catch (_){}
    throw new Error(msg);
  }
}

function render(todos) {
  listEl.innerHTML = '';
  if (!todos.length) {
    const li = document.createElement('li');
    li.className = 'todo-item';
    li.innerHTML = '<div class="content"><span class="desc">No todos yet. Add one above!</span></div>';
    listEl.appendChild(li);
    return;
  }

  for (const t of todos) {
    const li = document.createElement('li');
    li.className = 'todo-item' + (t.completed ? ' completed' : '');
    // Checkbox
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'checkbox';
    checkbox.checked = t.completed;
    checkbox.addEventListener('change', async () => {
      try {
        const updated = await updateTodo(t.id, { completed: checkbox.checked });
        Object.assign(t, updated);
        li.classList.toggle('completed', t.completed);
      } catch (err) {
        alert('Failed to toggle: ' + err.message);
        checkbox.checked = t.completed;
      }
    });

    // Content
    const content = document.createElement('div');
    content.className = 'content';
    const title = document.createElement('span');
    title.className = 'title';
    title.textContent = t.title;
    const desc = document.createElement('span');
    desc.className = 'desc';
    desc.textContent = t.description || '';
    content.appendChild(title);
    if (t.description) content.appendChild(desc);

    // Actions
    const actions = document.createElement('div');
    actions.className = 'actions';
    const editBtn = document.createElement('button');
    editBtn.className = 'btn';
    editBtn.textContent = 'Edit';
    editBtn.addEventListener('click', async () => {
      const newTitle = prompt('Edit title:', t.title);
      if (newTitle === null) return;
      const newDesc = prompt('Edit description:', t.description || '');
      if (newDesc === null) return;
      try {
        const updated = await updateTodo(t.id, { title: newTitle, description: newDesc });
        Object.assign(t, updated);
        await refresh(); // re-render
      } catch (err) {
        alert('Failed to update: ' + err.message);
      }
    });

    const delBtn = document.createElement('button');
    delBtn.className = 'btn danger';
    delBtn.textContent = 'Delete';
    delBtn.addEventListener('click', async () => {
      if (!confirm('Delete this todo?')) return;
      try {
        await deleteTodo(t.id);
        await refresh();
      } catch (err) {
        alert('Failed to delete: ' + err.message);
      }
    });

    actions.appendChild(editBtn);
    actions.appendChild(delBtn);

    li.appendChild(checkbox);
    li.appendChild(content);
    li.appendChild(actions);

    listEl.appendChild(li);
  }
}

async function refresh() {
  try {
    state.todos = await getTodos(state.filter);
    render(state.todos);
  } catch (err) {
    listEl.innerHTML = '<li class="todo-item"><div class="content"><span class="desc">Failed to load todos: ' + err.message + '</span></div></li>';
  }
}

// Initial load
refresh();

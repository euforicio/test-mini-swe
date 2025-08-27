(function(){
  const T = (window.TodoApp = window.TodoApp || {});
  const State = () => T.State;

  const qs = (sel, el = document) => el.querySelector(sel);
  const qsa = (sel, el = document) => Array.from(el.querySelectorAll(sel));

  let searchTimer = null;

  function init() {
    const form = qs('#new-task-form');
    const input = qs('#todo-input');
    const list = qs('#todo-list');
    const clearBtn = qs('#clear-completed');
    const filterButtons = qsa('.filter-btn');
    const search = qs('#search-box');

    // Add task
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const title = input.value;
      const task = State().addTask(title);
      if (task) {
        input.value = '';
        render();
        // Focus stays on input for faster entry
        input.focus();
      }
    });

    // Filters
    filterButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const f = btn.getAttribute('data-filter');
        State().setFilter(f);
        // Toggle aria-pressed
        filterButtons.forEach(b => b.setAttribute('aria-pressed', String(b === btn)));
        render();
        // Keep focus on the clicked filter
        btn.focus();
      });
    });

    // Search debounced
    search.addEventListener('input', () => {
      const val = search.value;
      if (searchTimer) clearTimeout(searchTimer);
      searchTimer = setTimeout(() => {
        State().setSearch(val);
        render(false); // don't steal focus
      }, 150);
    });

    // Clear Completed
    clearBtn.addEventListener('click', () => {
      const removed = State().counts().completed;
      if (removed === 0) return;
      const ok = window.confirm(`Clear ${removed} completed task${removed === 1 ? '' : 's'}?`);
      if (!ok) return;
      State().clearCompleted();
      render();
      // Move focus sensibly
      const firstItem = qs('#todo-list .todo-item input[type="checkbox"]');
      if (firstItem) firstItem.focus(); else input.focus();
    });

    // Initial render and focus
    render();
    input.focus();
  }

  function createItemElement(task, index, allIds) {
    const li = document.createElement('li');
    li.className = 'todo-item' + (task.completed ? ' completed' : '');
    li.setAttribute('data-id', task.id);

    // Checkbox
    const cb = document.createElement('input');
    cb.type = 'checkbox';
    cb.checked = !!task.completed;
    cb.id = `cb-${task.id}`;
    cb.setAttribute('aria-label', `${task.completed ? 'Mark as not completed' : 'Mark as completed'}: ${task.title}`);
    cb.addEventListener('change', () => {
      State().toggleComplete(task.id);
      // keep focus
      render(false);
      // restore focus after render
      focusTaskCheckbox(task.id);
    });

    // Title display (button for keyboard accessibility)
    const titleBtn = document.createElement('button');
    titleBtn.className = 'title';
    titleBtn.type = 'button';
    titleBtn.textContent = task.title;
    titleBtn.title = 'Edit title';
    titleBtn.addEventListener('click', () => beginEdit(li, task));
    titleBtn.addEventListener('dblclick', () => beginEdit(li, task));

    // Edit button
    const editBtn = document.createElement('button');
    editBtn.className = 'edit-btn';
    editBtn.type = 'button';
    editBtn.textContent = 'Edit';
    editBtn.addEventListener('click', () => beginEdit(li, task));

    // Delete button
    const delBtn = document.createElement('button');
    delBtn.className = 'delete-btn';
    delBtn.type = 'button';
    delBtn.setAttribute('aria-label', `Delete: ${task.title}`);
    delBtn.textContent = 'Delete';
    delBtn.addEventListener('click', () => {
      const nextFocusId = findNextFocusId(task.id, allIds);
      const removed = State().deleteTask(task.id);
      if (removed) {
        render(false);
        if (nextFocusId) focusTaskCheckbox(nextFocusId);
        else qs('#todo-input').focus();
      }
    });

    li.appendChild(cb);
    li.appendChild(titleBtn);
    li.appendChild(editBtn);
    li.appendChild(delBtn);
    return li;
  }

  function beginEdit(li, task) {
    const original = task.title;
    // Replace title button with input
    const titleBtn = li.querySelector('.title');
    const input = document.createElement('input');
    input.type = 'text';
    input.value = original;
    input.className = 'edit-input';
    input.setAttribute('aria-label', `Edit title: ${original}`);
    titleBtn.replaceWith(input);
    input.focus();
    input.setSelectionRange(original.length, original.length);

    let canceled = false;

    function finish(save) {
      input.removeEventListener('keydown', onKey);
      input.removeEventListener('blur', onBlur);
      if (save && String(input.value).trim()) {
        State().updateTitle(task.id, input.value);
      }
      // Re-render and restore focus to title control
      render(false);
      // Focus on the title button of this task (if still exists)
      const liNew = qs(`.todo-item[data-id="${task.id}"]`);
      if (liNew) {
        const btn = liNew.querySelector('.title');
        if (btn) btn.focus();
      } else {
        const inputTop = qs('#todo-input');
        if (inputTop) inputTop.focus();
      }
    }

    function onKey(e) {
      if (e.key === 'Enter') {
        e.preventDefault();
        finish(true);
      } else if (e.key === 'Escape') {
        e.preventDefault();
        canceled = true;
        finish(false);
      }
    }
    function onBlur() {
      if (!canceled) finish(true);
    }

    input.addEventListener('keydown', onKey);
    input.addEventListener('blur', onBlur);
  }

  function findNextFocusId(currentId, ids) {
    const idx = ids.indexOf(currentId);
    if (idx === -1) return null;
    // try same index after deletion -> next item shifts to current index
    const next = ids[idx + 1] || ids[idx - 1] || null;
    return next || null;
  }

  function focusTaskCheckbox(id) {
    const cb = qs(`.todo-item[data-id="${id}"] input[type="checkbox"]`);
    if (cb) cb.focus();
  }

  function render(updateFocus = true) {
    const list = qs('#todo-list');
    const counts = State().counts();
    const tasks = State().filteredTasks();
    const allIds = tasks.map(t => t.id);

    // Render list
    list.innerHTML = '';
    tasks.forEach((task, idx) => {
      list.appendChild(createItemElement(task, idx, allIds));
    });

    // Update counts and live region
    qs('#count-all').textContent = `(${counts.total})`;
    qs('#count-active').textContent = `(${counts.active})`;
    qs('#count-completed').textContent = `(${counts.completed})`;
    const live = qs('#live-region');
    live.textContent = `${counts.total} total, ${counts.active} active, ${counts.completed} completed.`;

    // Update filter button pressed state based on state
    const filter = State().getState().filter;
    qsa('.filter-btn').forEach(btn => {
      btn.setAttribute('aria-pressed', String(btn.getAttribute('data-filter') === filter));
    });

    // Nothing special for focus on general renders unless requested by callers
    if (!updateFocus) return;
  }

  T.DOM = { init, render };
})();

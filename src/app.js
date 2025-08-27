(function(){
  const T = (window.TodoApp = window.TodoApp || {});
  document.addEventListener('DOMContentLoaded', () => {
    const saved = T.Storage.load();
    T.State.init(saved);
    T.DOM.init();

    // Minimal HTML-driven test script (run in console if desired)
    // window.__todoTest = () => {
    //   const s = T.State;
    //   console.log('Initial counts:', s.counts());
    //   const t1 = s.addTask('Test A');
    //   const t2 = s.addTask('Test B');
    //   s.toggleComplete(t1.id);
    //   s.updateTitle(t2.id, 'Test B updated');
    //   console.log('After ops:', s.counts(), s.filteredTasks().map(t=>t.title));
    //   s.clearCompleted();
    //   console.log('After clear:', s.counts());
    // };
  });
})();

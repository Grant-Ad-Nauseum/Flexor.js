Flexor.registerPlugin('undo-redo', (container, config) => {
    const history = [];
    const redoStack = [];
    let initialState = Array.from(container.children).map(c => c.outerHTML);
    history.push(initialState);
  
    const saveState = () => {
      const currentState = Array.from(container.children).map(c => c.outerHTML);
      if (JSON.stringify(currentState) !== JSON.stringify(history[history.length - 1])) {
        history.push(currentState);
        redoStack.length = 0;
      }
    };
  
    container.addEventListener('drop', saveState);
  
    container.addEventListener('keydown', (e) => {
      if (e.ctrlKey && e.key === 'z') {
        if (history.length > 1) {
          redoStack.push(history.pop());
          container.innerHTML = history[history.length - 1].join('');
        }
      } else if (e.ctrlKey && e.key === 'y') {
        if (redoStack.length > 0) {
          history.push(redoStack.pop());
          container.innerHTML = history[history.length - 1].join('');
        }
      }
    });
  });
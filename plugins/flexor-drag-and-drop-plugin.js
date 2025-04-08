Flexor.registerPlugin('drag-drop', (container, config) => {
    const children = Array.from(container.children);
    const storageKey = `flexor-order-${container.id || container.dataset.flexor}`;
    let dragged;
  
    // Load saved order from localStorage
    const savedOrder = localStorage.getItem(storageKey);
    if (savedOrder) {
      const order = JSON.parse(savedOrder);
      order.forEach((index, i) => {
        if (children[index]) container.appendChild(children[index]);
      });
    }
  
    children.forEach(child => {
      child.draggable = true;
      child.style.transition = 'transform 0.2s ease';
      child.style.cursor = 'grab';
  
      child.addEventListener('dragstart', (e) => {
        dragged = child;
        e.dataTransfer.effectAllowed = 'move';
        child.style.opacity = '0.5';
      });
  
      child.addEventListener('dragend', () => {
        dragged.style.opacity = '1';
        const newOrder = Array.from(container.children).map(c => children.indexOf(c));
        localStorage.setItem(storageKey, JSON.stringify(newOrder));
      });
  
      child.addEventListener('dragover', (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
      });
  
      child.addEventListener('drop', (e) => {
        e.preventDefault();
        if (dragged !== child) {
          const allChildren = Array.from(container.children);
          const fromIndex = allChildren.indexOf(dragged);
          const toIndex = allChildren.indexOf(child);
          if (fromIndex < toIndex) {
            child.after(dragged);
          } else {
            child.before(dragged);
          }
        }
      });
    });
  });
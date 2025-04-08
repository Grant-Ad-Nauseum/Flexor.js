Flexor.registerPlugin('snap-grid', (container, config) => {
    const gridSize = 20; // Default grid size in pixels
    const children = Array.from(container.children);
  
    children.forEach(child => {
      child.style.position = 'absolute'; // Relative to container
      child.style.left = '0';
      child.style.top = '0';
      child.draggable = true;
  
      child.addEventListener('dragstart', (e) => {
        e.dataTransfer.setData('text/plain', child.dataset.index);
      });
  
      child.addEventListener('dragover', (e) => e.preventDefault());
  
      child.addEventListener('drop', (e) => {
        e.preventDefault();
        const x = Math.round(e.offsetX / gridSize) * gridSize;
        const y = Math.round(e.offsetY / gridSize) * gridSize;
        child.style.left = `${x}px`;
        child.style.top = `${y}px`;
      });
    });
  
    container.style.position = 'relative';
    container.style.height = '400px'; // Default height, adjustable
    container.style.overflow = 'hidden';
  });
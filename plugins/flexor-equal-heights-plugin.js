Flexor.registerPlugin('equal-heights', (container, config) => {
    if (config.direction !== 'row') return; // Only for rows
  
    const children = Array.from(container.children);
    const resetHeights = () => {
      children.forEach(child => child.style.height = 'auto'); // Reset to measure natural height
      const maxHeight = Math.max(...children.map(child => child.offsetHeight));
      children.forEach(child => child.style.height = `${maxHeight}px`);
    };
  
    resetHeights(); // Initial call
    window.addEventListener('resize', resetHeights); // Update on resize
  });
Flexor.registerPlugin('auto-columns', (container, config) => {
    if (config.direction !== 'row' || !config.wrap) return; // Requires row and wrap
  
    const updateColumns = () => {
      const width = container.offsetWidth;
      const minChildWidth = 200; // Minimum width per child in pixels
      const columnCount = Math.max(1, Math.floor(width / minChildWidth));
      const children = Array.from(container.children);
  
      children.forEach(child => {
        child.style.flex = `1 0 ${100 / columnCount - 1}%`; // Adjust width with small buffer
      });
    };
  
    updateColumns(); // Initial call
    window.addEventListener('resize', updateColumns); // Update on resize
  });
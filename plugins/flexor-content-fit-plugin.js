Flexor.registerPlugin('content-fit', (container, config) => {
    const updateSize = () => {
      const children = Array.from(container.children);
      container.style.display = 'block'; // Measure natural size
      const sizes = children.map(child => ({
        width: child.offsetWidth,
        height: child.offsetHeight
      }));
      container.style.display = 'flex'; // Restore Flexor layout
  
      const maxWidth = Math.max(...sizes.map(s => s.width));
      const maxHeight = Math.max(...sizes.map(s => s.height));
  
      if (config.direction === 'row') {
        container.style.minHeight = `${maxHeight}px`;
      } else {
        container.style.minWidth = `${maxWidth}px`;
      }
    };
  
    updateSize(); // Initial call
    window.addEventListener('resize', updateSize);
  
    // Observe content changes (e.g., dynamic text)
    const observer = new MutationObserver(updateSize);
    observer.observe(container, { childList: true, subtree: true, characterData: true });
  });
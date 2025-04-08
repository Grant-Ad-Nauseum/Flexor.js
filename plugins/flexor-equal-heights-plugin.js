Flexor.registerPlugin('equal-heights', (container, config) => {
  const children = Array.from(container.children);
  const resizeObserver = new ResizeObserver(() => {
    children.forEach(child => child.style.height = 'auto'); // Reset first
    const maxHeight = Math.max(...children.map(child => child.offsetHeight));
    children.forEach(child => child.style.height = `${maxHeight}px`);
  });
  resizeObserver.observe(container);
  children.forEach(child => resizeObserver.observe(child));
});

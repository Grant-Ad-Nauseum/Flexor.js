Flexor.registerPlugin('equal-heights', (container, config) => {
  const children = Array.from(container.children);
  const resizeObserver = new ResizeObserver(() => {
    // Reset heights to natural size before measuring
    children.forEach(child => child.style.height = 'auto');
    // Use clientHeight for content height (excluding margins)
    const maxHeight = Math.max(...children.map(child => child.clientHeight));
    // Apply the tallest height to all children
    children.forEach(child => child.style.height = `${maxHeight}px`);
  });
  // Observe container and children for size changes
  resizeObserver.observe(container);
  children.forEach(child => resizeObserver.observe(child));
});

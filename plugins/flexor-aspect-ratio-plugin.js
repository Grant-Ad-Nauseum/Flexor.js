Flexor.registerPlugin('aspect-ratio', (container, config) => {
  Array.from(container.children).forEach(child => {
    child.style.aspectRatio = '1 / 1';
    child.style.maxWidth = '200px'; // Constrain width
    const observer = new ResizeObserver(() => {
      child.style.height = `${child.offsetWidth}px`;
    });
    observer.observe(child);
  });
});

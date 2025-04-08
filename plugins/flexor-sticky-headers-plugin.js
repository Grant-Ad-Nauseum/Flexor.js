Flexor.registerPlugin('sticky-headers', (container, config) => {
    const children = Array.from(container.children);
    children.forEach((child, index) => {
      if (index % 2 === 0) { // Every other child as header
        child.style.position = 'sticky';
        child.style.top = '0';
        child.style.background = '#f0f0f0';
        child.style.zIndex = '10';
      }
    });
    container.style.overflowY = 'auto';
    container.style.maxHeight = '400px';
  });
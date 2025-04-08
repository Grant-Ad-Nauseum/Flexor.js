Flexor.registerPlugin('gap-fill', (container, config) => {
    const desiredCount = 6; // Default items per row/column
    const children = Array.from(container.children);
    const fillCount = desiredCount - (children.length % desiredCount || desiredCount);
  
    for (let i = 0; i < fillCount; i++) {
      const filler = document.createElement('div');
      filler.style.flex = children[0]?.style.flex || '1 1 0';
      filler.style.background = '#f5f5f5';
      container.appendChild(filler);
    }
  });
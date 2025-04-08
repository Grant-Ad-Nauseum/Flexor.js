Flexor.registerPlugin('resize-observer', (container, config) => {
    const observer = new ResizeObserver(() => {
      const width = container.offsetWidth;
      const children = Array.from(container.children);
      if (width < 400 && config.direction === 'row') {
        container.style.flexDirection = 'column';
        children.forEach(child => child.style.flex = 'auto');
      } else {
        container.style.flexDirection = config.direction;
        config.proportions.forEach((prop, i) => {
          if (children[i]) children[i].style.flex = `${prop} 1 0`;
        });
      }
    });
    observer.observe(container);
  });
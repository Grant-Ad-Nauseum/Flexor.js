Flexor.registerPlugin('rtl-support', (container, config) => {
    const isRTL = document.documentElement.dir === 'rtl' || container.closest('[dir="rtl"]');
    if (isRTL && config.direction === 'row') {
      container.style.flexDirection = 'row-reverse';
      const children = Array.from(container.children);
      children.forEach(child => {
        child.style.textAlign = 'right';
      });
    }
  });
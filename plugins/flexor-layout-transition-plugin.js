Flexor.registerPlugin('layout-transition', (container, config) => {
    const children = Array.from(container.children);
    children.forEach(child => {
      child.style.transition = 'all 0.3s ease';
    });
  
    const observer = new MutationObserver(() => {
      children.forEach(child => {
        child.animate([
          { transform: 'scale(0.95)', opacity: 0.8 },
          { transform: 'scale(1)', opacity: 1 }
        ], { duration: 300, easing: 'ease-in-out' });
      });
    });
    observer.observe(container, { attributes: true, attributeFilter: ['data-flexor'] });
  });
Flexor.registerPlugin('hover-effects', (container, config) => {
    const children = Array.from(container.children);
    children.forEach(child => {
      child.style.transition = 'transform 0.3s ease, background-color 0.3s ease';
      child.addEventListener('mouseenter', () => {
        child.style.transform = 'scale(1.05)';
        child.style.backgroundColor = 'rgba(0, 0, 0, 0.1)';
      });
      child.addEventListener('mouseleave', () => {
        child.style.transform = 'scale(1)';
        child.style.backgroundColor = '';
      });
    });
  });
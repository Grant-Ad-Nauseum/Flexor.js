Flexor.registerPlugin('accessibility-boost', (container, config) => {
    // Add ARIA roles
    container.setAttribute('role', 'group');
    container.setAttribute('aria-label', 'Flexor layout container');
  
    const children = Array.from(container.children);
    children.forEach((child, index) => {
      child.setAttribute('role', 'region');
      child.setAttribute('aria-label', `Item ${index + 1}`);
      child.tabIndex = 0; // Make focusable
  
      // Keyboard navigation
      child.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
          const next = children[index + 1];
          if (next) next.focus();
          e.preventDefault();
        } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
          const prev = children[index - 1];
          if (prev) prev.focus();
          e.preventDefault();
        }
      });
    });
  });
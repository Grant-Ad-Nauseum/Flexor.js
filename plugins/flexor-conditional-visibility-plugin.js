Flexor.registerPlugin('conditional-visibility', (container, config) => {
    const children = Array.from(container.children);
    children.forEach((child, index) => {
      const hideAt = child.dataset.hideAt || (index === 0 ? '500px' : null); // Example: hide first child at 500px
      if (!hideAt) return;
  
      child.style.transition = 'opacity 0.3s ease, visibility 0s linear 0.3s';
      const mediaQuery = window.matchMedia(`(max-width: ${hideAt})`);
      const updateVisibility = () => {
        if (mediaQuery.matches) {
          child.style.opacity = '0';
          child.style.visibility = 'hidden';
        } else {
          child.style.opacity = '1';
          child.style.visibility = 'visible';
          child.style.transitionDelay = '0s';
        }
      };
  
      updateVisibility(); // Initial call
      mediaQuery.addEventListener('change', updateVisibility);
    });
  });
Flexor.registerPlugin('order-switch', (container, config) => {
    const children = Array.from(container.children);
    if (!config.stackAt) return; // Requires a stack breakpoint
  
    const breakpoint = Flexor.breakpoints[config.stackAt] || (config.stackAt.match(/^\d+px$/) ? config.stackAt : null);
    if (!breakpoint) return;
  
    const mediaQuery = window.matchMedia(`(max-width: ${breakpoint})`);
    const updateOrder = () => {
      if (mediaQuery.matches) {
        // Reverse order on small screens
        children.forEach((child, index) => {
          child.style.order = (children.length - 1 - index).toString();
        });
      } else {
        // Reset to original order
        children.forEach(child => child.style.order = '');
      }
    };
  
    updateOrder(); // Initial call
    mediaQuery.addEventListener('change', updateOrder); // Update on screen size change
  });
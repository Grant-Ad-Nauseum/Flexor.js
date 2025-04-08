Flexor.registerPlugin('animation', (container, config) => {
    const children = Array.from(container.children);
    children.forEach((child, index) => {
      // Set initial state
      child.style.opacity = '0';
      child.style.transform = 'translateY(20px)';
      child.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
  
      // Trigger animation with delay based on index
      setTimeout(() => {
        child.style.opacity = '1';
        child.style.transform = 'translateY(0)';
      }, index * 100); // Staggered delay for each child
    });
  });
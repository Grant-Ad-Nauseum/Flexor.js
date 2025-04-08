Flexor.registerPlugin('background-switch', (container, config) => {
    const colors = ['#f0f8ff', '#e6ffe6', '#ffe6e6', '#fffacd']; // Light color options
    const children = Array.from(container.children);
  
    children.forEach((child, index) => {
      child.style.backgroundColor = colors[index % colors.length];
    });
  });
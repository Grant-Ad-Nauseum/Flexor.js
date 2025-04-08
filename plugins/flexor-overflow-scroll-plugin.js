Flexor.registerPlugin('overflow-scroll', (container, config) => {
    container.style.overflowX = config.direction === 'row' ? 'auto' : 'hidden';
    container.style.overflowY = config.direction === 'col' ? 'auto' : 'hidden';
    container.style.maxHeight = config.direction === 'col' ? '400px' : 'inherit'; // Default max height for columns
    container.style.maxWidth = config.direction === 'row' ? '100%' : 'inherit';
  
    // Style scrollbar for better UX
    container.style.scrollbarWidth = 'thin';
    container.style.scrollbarColor = '#888 #f1f1f1';
  });
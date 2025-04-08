Flexor.registerPlugin('content-align', (container, config) => {
    const alignments = {
      'center': 'center',
      'start': 'flex-start',
      'end': 'flex-end'
    };
    const contentAlign = config.align ? `content-${config.align}` : 'content-center'; // Default to center
  
    const children = Array.from(container.children);
    children.forEach(child => {
      child.style.display = 'flex';
      child.style.flexDirection = 'column';
      child.style.justifyContent = alignments[contentAlign.split('-')[1]] || 'center';
      child.style.alignItems = 'center';
      child.style.height = '100%'; // Ensure full height for alignment
    });
  });
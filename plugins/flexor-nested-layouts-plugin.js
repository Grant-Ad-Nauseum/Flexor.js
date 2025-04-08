Flexor.registerPlugin('nested-layouts', (container, config) => {
    const parentFlexor = container.closest('[data-flexor]');
    if (parentFlexor) {
      // Adjust nested container to respect parent
      container.style.flex = config.direction === 'row' ? '1 0 auto' : 'auto 1 0';
      container.style.width = config.direction === 'row' ? 'auto' : '100%';
      container.style.height = config.direction === 'col' ? 'auto' : '100%';
  
      // Prevent stacking interference if parent stacks
      if (config.stackAt && parentFlexor.dataset.flexor.includes('stack-')) {
        const parentBreakpoint = parentFlexor.dataset.flexor.match(/stack-(\w+)/)?.[1];
        if (parentBreakpoint && config.stackAt !== parentBreakpoint) {
          container.style.flexDirection = ''; // Let CSS handle stacking
        }
      }
    }
  
    // Ensure children of nested container inherit properly
    const children = Array.from(container.children);
    children.forEach(child => {
      if (!child.style.flex) {
        child.style.flex = '1 0 auto'; // Default flex for nested children
      }
    });
  });
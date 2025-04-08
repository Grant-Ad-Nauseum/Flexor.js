Flexor.registerPlugin('equal-heights', (container, config) => {
  const children = Array.from(container.children);
  
  // Measure intrinsic height
  const sandbox = document.createElement('div');
  sandbox.style.position = 'absolute';
  sandbox.style.visibility = 'hidden';
  sandbox.style.display = 'block';
  document.body.appendChild(sandbox);
  
  const clones = children.map(child => {
    const clone = child.cloneNode(true);
    clone.style.height = 'auto';
    clone.style.flex = 'none';
    clone.style.display = 'block';
    sandbox.appendChild(clone);
    return clone;
  });
  const naturalHeights = clones.map(clone => clone.getBoundingClientRect().height);
  const maxHeight = Math.max(...naturalHeights);
  sandbox.remove();
  
  // Lock container and children
  container.style.height = `${maxHeight}px`; // Match tallest child
  container.style.maxHeight = `${maxHeight}px`;
  container.style.alignItems = 'flex-start';
  container.style.overflow = 'hidden'; // No scrolling
  children.forEach((child, i) => {
    child.style.height = `${maxHeight}px`;
    child.style.maxHeight = `${maxHeight}px`;
    child.style.flex = config.proportions 
      ? `${config.proportions[i] || 1} 0 ${maxHeight}px`
      : `1 0 ${maxHeight}px`;
    child.style.overflow = 'hidden';
  });
  
  // Override all flex resets with CSS
  const styleId = `equal-heights-lock-${container.id || 'demo-container'}`;
  let style = document.getElementById(styleId);
  if (!style) {
    style = document.createElement('style');
    style.id = styleId;
    document.head.appendChild(style);
  }
  style.textContent = `
    #${container.id || 'demo-container'} {
      height: ${maxHeight}px !important;
      max-height: ${maxHeight}px !important;
      align-items: flex-start !important;
      overflow: hidden !important;
    }
    #${container.id || 'demo-container'} > .demo-item {
      height: ${maxHeight}px !important;
      max-height: ${maxHeight}px !important;
      flex: ${config.proportions ? config.proportions.map(p => `${p} 0 ${maxHeight}px`).join(', ') : `1 0 ${maxHeight}px`} !important;
      overflow: hidden !important;
    }
  `;
});

Flexor.registerPlugin('equal-heights', (container, config) => {
  const children = Array.from(container.children);
  
  // Measure intrinsic height once
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
  
  // Lock heights and prevent flex stretching
  children.forEach((child, i) => {
    child.style.height = `${maxHeight}px`;
    child.style.minHeight = `${maxHeight}px`;
    child.style.maxHeight = `${maxHeight}px`;
    child.style.flex = config.proportions 
      ? `${config.proportions[i] || 1} 0 ${maxHeight}px`
      : `1 0 ${maxHeight}px`;
    child.style.boxSizing = 'border-box'; // Ensure padding fits within height
  });
  
  // Add CSS rule to enforce height stability
  const styleId = `equal-heights-fix-${container.id || 'demo-container'}`;
  let style = document.getElementById(styleId);
  if (!style) {
    style = document.createElement('style');
    style.id = styleId;
    document.head.appendChild(style);
  }
  style.textContent = `
    #${container.id || 'demo-container'} > .demo-item {
      height: ${maxHeight}px !important;
      min-height: ${maxHeight}px !important;
      max-height: ${maxHeight}px !important;
      flex-grow: 0 !important;
      flex-shrink: 0 !important;
    }
  `;
});

Flexor.registerPlugin('equal-heights', (container, config) => {
  const children = Array.from(container.children);
  
  // Function to measure and set heights
  const setEqualHeights = () => {
    // Sandbox for intrinsic height
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
    
    // Apply heights and lock flex
    children.forEach(child => {
      child.style.height = `${maxHeight}px`;
      child.style.minHeight = `${maxHeight}px`;
      child.style.maxHeight = `${maxHeight}px`;
      child.style.flex = config.proportions 
        ? `${config.proportions[children.indexOf(child)] || 1} 0 ${maxHeight}px`
        : `1 0 ${maxHeight}px`;
    });
  };
  
  // Initial application
  setEqualHeights();
  
  // Debounced update for content changes only
  let timeout;
  const updateHeights = () => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      setEqualHeights();
    }, 100); // 100ms debounce
  };
  
  // Observe content changes, not style mutations
  const observer = new MutationObserver(mutations => {
    const isContentChange = mutations.some(mutation => 
      mutation.type === 'childList' || 
      (mutation.type === 'characterData' && mutation.target.nodeType === Node.TEXT_NODE)
    );
    if (isContentChange) {
      updateHeights();
    }
  });
  observer.observe(container, { 
    childList: true, 
    subtree: true, 
    characterData: true, 
    attributes: false // Ignore style changes
  });
});

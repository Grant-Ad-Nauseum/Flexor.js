Flexor.registerPlugin('sticky', (container, config) => {
    const firstChild = container.children[0];
    if (!firstChild) return;
  
    firstChild.style.position = 'sticky';
    firstChild.style.top = '0';
    firstChild.style.zIndex = '10'; // Ensure it stays above other content
  
    // Optional: Add a background to avoid overlap visibility issues
    if (!firstChild.style.backgroundColor) {
      firstChild.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
    }
  });
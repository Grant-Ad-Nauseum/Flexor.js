Flexor.registerPlugin('masonry', (container, config) => {
    if (!config.wrap || config.direction !== 'row') return;
    const columns = 3; // Default column count
    const children = Array.from(container.children);
  
    const updateMasonry = () => {
      const columnWidth = container.offsetWidth / columns;
      const columnHeights = Array(columns).fill(0);
  
      children.forEach(child => {
        child.style.width = `${columnWidth - (parseFloat(config.gap) || 0)}px`;
        const minHeightIndex = columnHeights.indexOf(Math.min(...columnHeights));
        child.style.position = 'absolute';
        child.style.left = `${minHeightIndex * columnWidth}px`;
        child.style.top = `${columnHeights[minHeightIndex]}px`;
        columnHeights[minHeightIndex] += child.offsetHeight + (parseFloat(config.gap) || 0);
      });
  
      container.style.height = `${Math.max(...columnHeights)}px`;
      container.style.position = 'relative';
    };
  
    updateMasonry();
    window.addEventListener('resize', updateMasonry);
  });
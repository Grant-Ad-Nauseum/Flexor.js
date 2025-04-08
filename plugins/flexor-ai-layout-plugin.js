Flexor.registerPlugin('ai-layout', (container, config) => {
    const children = Array.from(container.children);
    const updateLayout = () => {
      const weights = children.map(child => {
        const textLength = child.textContent.length;
        const imgArea = child.querySelector('img')?.width * child.querySelector('img')?.height || 0;
        return Math.max(textLength / 100, imgArea / 10000, 1); // Heuristic
      });
      const totalWeight = weights.reduce((a, b) => a + b, 0);
      children.forEach((child, i) => {
        child.style.flex = `${weights[i] / totalWeight * 10} 1 0`;
      });
  
      const width = container.offsetWidth;
      container.style.flexDirection = width < 400 ? 'column' : config.direction;
    };
  
    updateLayout();
    window.addEventListener('resize', updateLayout);
    new MutationObserver(updateLayout).observe(container, { childList: true, subtree: true });
  });
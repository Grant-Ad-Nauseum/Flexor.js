Flexor.registerPlugin('aspect-ratio', (container, config) => {
    const [width, height] = [16, 9]; // Default 16:9 ratio
    const applyRatio = () => {
      const containerWidth = container.offsetWidth;
      container.style.height = `${(containerWidth * height) / width}px`;
      container.style.overflow = 'hidden';
    };
  
    applyRatio();
    window.addEventListener('resize', applyRatio);
  });
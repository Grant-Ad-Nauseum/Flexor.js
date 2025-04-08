Flexor.registerPlugin('dynamic-spacing', (container, config) => {
    const updateSpacing = () => {
      const dimension = config.direction === 'row' ? container.offsetWidth : container.offsetHeight;
      const baseGap = 10; // Base gap in pixels
      const scaleFactor = dimension / 1000; // Scale relative to 1000px
      const dynamicGap = Math.max(5, Math.min(30, baseGap * scaleFactor)); // Min 5px, max 30px
      container.style.gap = `${dynamicGap}px`;
    };
  
    updateSpacing(); // Initial call
    window.addEventListener('resize', updateSpacing); // Update on resize
  
    // Cleanup on container removal (optional for performance)
    const observer = new MutationObserver(() => {
      if (!document.body.contains(container)) {
        window.removeEventListener('resize', updateSpacing);
        observer.disconnect();
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });
  });
Flexor.registerPlugin('responsive-text', (container, config) => {
    const updateTextSize = () => {
      const width = container.offsetWidth;
      const baseSize = 16; // Base font size in pixels
      const scale = Math.max(0.5, Math.min(1.5, width / 600)); // Scale between 0.5x and 1.5x
      container.style.fontSize = `${baseSize * scale}px`;
    };
  
    updateTextSize(); // Initial call
    window.addEventListener('resize', updateTextSize); // Update on resize
  });
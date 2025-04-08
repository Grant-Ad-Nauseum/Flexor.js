Flexor.registerPlugin('parallax', (container, config) => {
    const children = Array.from(container.children);
    children.forEach((child, index) => {
      child.style.backgroundPosition = 'center';
      child.style.backgroundSize = 'cover';
      child.style.backgroundAttachment = 'fixed'; // Fallback
    });
  
    const updateParallax = () => {
      const scrollTop = window.scrollY;
      children.forEach((child, index) => {
        const speed = 0.2 * (index + 1);
        child.style.backgroundPositionY = `${scrollTop * speed}px`;
      });
    };
  
    window.addEventListener('scroll', updateParallax);
  });
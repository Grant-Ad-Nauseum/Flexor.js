Flexor.registerPlugin('load-balance', (container, config) => {
    const children = Array.from(container.children);
    children.forEach(child => child.style.opacity = '0');
  
    let index = 0;
    const renderNext = () => {
      if (index < children.length) {
        children[index].style.transition = 'opacity 0.3s ease';
        children[index].style.opacity = '1';
        index++;
        requestAnimationFrame(renderNext);
      }
    };
  
    requestAnimationFrame(renderNext);
  });
Flexor.registerPlugin('motion-path', (container, config) => {
    const children = Array.from(container.children);
    children.forEach(child => {
      child.animate([
        { offsetDistance: '0%', offsetPath: 'path("M 0 0 Q 100 200 200 0")' },
        { offsetDistance: '100%', offsetPath: 'path("M 0 0 Q 100 200 200 0")' }
      ], {
        duration: 2000,
        iterations: Infinity,
        easing: 'ease-in-out'
      });
      child.style.offsetPath = 'path("M 0 0 Q 100 200 200 0")';
      child.style.position = 'absolute';
    });
    container.style.position = 'relative';
    container.style.height = '200px';
  });
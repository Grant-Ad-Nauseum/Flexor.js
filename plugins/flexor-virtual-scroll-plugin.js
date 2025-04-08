Flexor.registerPlugin('virtual-scroll', (container, config) => {
    const itemHeight = 50; // Fixed height per item
    const totalItems = 1000; // Example dataset size
    container.style.overflowY = 'auto';
    container.style.height = '400px';
  
    const updateVisible = () => {
      const scrollTop = container.scrollTop;
      const visibleCount = Math.ceil(container.clientHeight / itemHeight);
      const startIndex = Math.floor(scrollTop / itemHeight);
      const endIndex = Math.min(startIndex + visibleCount, totalItems);
  
      container.innerHTML = '';
      for (let i = startIndex; i < endIndex; i++) {
        const child = document.createElement('div');
        child.textContent = `Item ${i + 1}`;
        child.style.height = `${itemHeight}px`;
        container.appendChild(child);
      }
      container.style.paddingTop = `${startIndex * itemHeight}px`;
    };
  
    updateVisible();
    container.addEventListener('scroll', updateVisible);
  });
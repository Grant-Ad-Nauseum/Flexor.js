Flexor.registerPlugin('virtual-scroll', (container, config) => {
  const itemHeight = 50; // Fixed height for virtual items
  const visibleItems = Math.ceil(container.offsetHeight / itemHeight) + 2; // Buffer for smooth scrolling
  const totalItems = 100; // Total virtual items to simulate
  let startIndex = 0;
  let virtualContainer = null;

  // Create a sub-container for virtual items to avoid overwriting original content
  if (!container.querySelector('.virtual-scroll-container')) {
    virtualContainer = document.createElement('div');
    virtualContainer.className = 'virtual-scroll-container';
    virtualContainer.style.position = 'relative';
    virtualContainer.style.height = `${totalItems * itemHeight}px`; // Total scrollable height
    container.appendChild(virtualContainer);
  } else {
    virtualContainer = container.querySelector('.virtual-scroll-container');
  }

  container.style.overflowY = 'auto';

  const renderItems = () => {
    if (!virtualContainer) return;
    virtualContainer.innerHTML = ''; // Clear previous virtual items
    const endIndex = Math.min(startIndex + visibleItems, totalItems);
    for (let i = startIndex; i < endIndex; i++) {
      const item = document.createElement('div');
      item.textContent = `Virtual Item ${i + 1}`;
      item.style.height = `${itemHeight}px`;
      item.style.background = i % 2 ? '#eee' : '#fff';
      item.style.position = 'absolute';
      item.style.top = `${i * itemHeight}px`;
      item.style.width = '100%';
      virtualContainer.appendChild(item);
    }
  };

  const scrollHandler = () => {
    startIndex = Math.floor(container.scrollTop / itemHeight);
    renderItems();
  };

  container.addEventListener('scroll', scrollHandler);
  renderItems();

  // Cleanup function (called when plugin is unregistered or reapplied)
  container.dataset.virtualScrollCleanup = () => {
    container.removeEventListener('scroll', scrollHandler);
    if (virtualContainer) {
      virtualContainer.remove();
    }
  };
});

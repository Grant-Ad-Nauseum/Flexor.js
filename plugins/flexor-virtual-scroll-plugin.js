Flexor.registerPlugin('virtual-scroll', (container, config) => {
  const itemHeight = 50;
  const visibleItems = Math.ceil(container.offsetHeight / itemHeight) + 2;
  const totalItems = 100;
  let startIndex = 0;

  container.style.overflowY = 'auto';
  container.style.position = 'relative';

  const renderItems = () => {
    const endIndex = Math.min(startIndex + visibleItems, totalItems);
    const fragment = document.createDocumentFragment();
    for (let i = startIndex; i < endIndex; i++) {
      const item = document.createElement('div');
      item.textContent = `Virtual Item ${i + 1}`;
      item.style.height = `${itemHeight}px`;
      item.style.background = i % 2 ? '#eee' : '#fff';
      item.style.position = 'absolute';
      item.style.top = `${i * itemHeight}px`;
      item.style.width = '100%';
      fragment.appendChild(item);
    }
    container.appendChild(fragment); // Append instead of replace
  };

  container.addEventListener('scroll', () => {
    startIndex = Math.floor(container.scrollTop / itemHeight);
    renderItems();
  });
  renderItems();
});

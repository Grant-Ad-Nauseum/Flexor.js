Flexor.registerPlugin('infinite-scroll', (container, config) => {
    let page = 1;
    const loadMore = () => {
      if (container.scrollTop + container.clientHeight >= container.scrollHeight - 50) {
        for (let i = 0; i < 3; i++) {
          const child = document.createElement('div');
          child.textContent = `Item ${page * 3 + i + 1}`;
          child.style.background = '#e0e0e0';
          container.appendChild(child);
        }
        page++;
        Flexor.applyTo(container); // Reapply styles
      }
    };
  
    container.style.overflowY = 'auto';
    container.style.maxHeight = '400px';
    container.addEventListener('scroll', loadMore);
  });
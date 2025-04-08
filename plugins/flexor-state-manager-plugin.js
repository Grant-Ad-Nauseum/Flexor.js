Flexor.registerPlugin('state-manager', (container, config) => {
    const storageKey = `flexor-state-${container.id || 'default'}`;
    const urlParams = new URLSearchParams(window.location.search);
    const savedState = urlParams.get('layout') || localStorage.getItem(storageKey);
  
    if (savedState) {
      const state = JSON.parse(savedState);
      state.order.forEach((index, i) => container.appendChild(container.children[index]));
      state.visibility.forEach((visible, i) => {
        if (!visible) container.children[i].style.display = 'none';
      });
    }
  
    const saveState = () => {
      const state = {
        order: Array.from(container.children).map((_, i) => i),
        visibility: Array.from(container.children).map(c => c.style.display !== 'none')
      };
      localStorage.setItem(storageKey, JSON.stringify(state));
      urlParams.set('layout', JSON.stringify(state));
      window.history.replaceState({}, '', `${location.pathname}?${urlParams}`);
    };
  
    container.addEventListener('drop', saveState);
    container.addEventListener('DOMSubtreeModified', saveState);
  });
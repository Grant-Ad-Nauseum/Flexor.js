Flexor.registerPlugin('layout-debug', (container, config) => {
    let isActive = false;
    const toggleDebug = (e) => {
      if (e.ctrlKey && e.key === 'd') {
        isActive = !isActive;
        const children = Array.from(container.children);
        children.forEach((child, i) => {
          if (isActive) {
            const label = document.createElement('span');
            label.textContent = `Prop: ${config.proportions[i] || 'auto'}`;
            label.style.position = 'absolute';
            label.style.background = 'rgba(0, 0, 0, 0.7)';
            label.style.color = '#fff';
            label.style.padding = '2px 5px';
            child.style.position = 'relative';
            child.appendChild(label);
            container.style.outline = '2px dashed blue';
          } else {
            child.querySelector('span')?.remove();
            container.style.outline = '';
          }
        });
      }
    };
    document.addEventListener('keydown', toggleDebug);
  });
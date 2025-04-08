Flexor.registerPlugin('component-export', (container, config) => {
    const exportBtn = document.createElement('button');
    exportBtn.textContent = 'Export Layout';
    exportBtn.style.position = 'absolute';
    exportBtn.style.top = '5px';
    exportBtn.style.right = '5px';
    container.style.position = 'relative';
    container.appendChild(exportBtn);
  
    exportBtn.addEventListener('click', () => {
      const html = container.outerHTML;
      const css = `
        #${container.id || 'flexor-export'} {
          display: flex;
          flex-direction: ${config.direction};
          gap: ${config.gap || '0'};
          ${config.wrap ? 'flex-wrap: wrap;' : ''}
        }
      `;
      const js = `Flexor.applyTo(document.getElementById('${container.id || 'flexor-export'}'));`;
      const snippet = `<html><head><style>${css}</style></head><body>${html}<script src="flexor.js"></script><script>${js}</script></body></html>`;
  
      navigator.clipboard.writeText(snippet);
      alert('Layout copied to clipboard!');
    });
  });
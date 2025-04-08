Flexor.registerPlugin('ssr-prep', (container, config) => {
    const style = document.createElement('style');
    const id = `flexor-ssr-${Math.random().toString(36).slice(2)}`;
    container.id = container.id || id;
    
    const css = `
      #${container.id} {
        display: flex;
        flex-direction: ${config.direction};
        gap: ${config.gap || '0'};
        ${config.wrap ? 'flex-wrap: wrap;' : ''}
      }
      #${container.id} > * {
        ${config.proportions.map(p => `flex: ${p} 1 0;`).join('')}
      }
    `;
    style.textContent = css;
    document.head.appendChild(style);
  
    // Reapply on client-side to ensure hydration
    Flexor.applyTo(container);
  });
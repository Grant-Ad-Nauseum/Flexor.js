Flexor.registerPlugin('container-queries', (container, config) => {
    container.style.containerType = 'inline-size';
    const style = document.createElement('style');
    style.textContent = `
      @container (max-width: 400px) {
        [data-flexor~="container-queries"] {
          flex-direction: column !important;
        }
        [data-flexor~="container-queries"] > * {
          flex: auto !important;
        }
      }
    `;
    document.head.appendChild(style);
  });
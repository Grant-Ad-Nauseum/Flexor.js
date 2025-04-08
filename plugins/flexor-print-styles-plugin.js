Flexor.registerPlugin('print-styles', (container, config) => {
    const style = document.createElement('style');
    style.textContent = `
      @media print {
        [data-flexor~="print-styles"] {
          flex-direction: column !important;
          gap: 10px !important;
        }
        [data-flexor~="print-styles"] > * {
          flex: auto !important;
          width: 100% !important;
          background: none !important;
          color: #000 !important;
        }
      }
    `;
    document.head.appendChild(style);
  });
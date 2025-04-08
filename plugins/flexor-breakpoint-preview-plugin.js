Flexor.registerPlugin('breakpoint-preview', (container, config) => {
    if (!config.stackAt) return;
  
    const breakpoint = Flexor.breakpoints[config.stackAt] || (config.stackAt.match(/^\d+px$/) ? config.stackAt : null);
    if (!breakpoint) return;
  
    const previewButton = document.createElement('button');
    previewButton.textContent = `Preview ${breakpoint}`;
    previewButton.style.position = 'absolute';
    previewButton.style.top = '5px';
    previewButton.style.right = '5px';
    previewButton.style.zIndex = '1000';
    container.style.position = 'relative';
    container.appendChild(previewButton);
  
    let isPreviewing = false;
    previewButton.addEventListener('click', () => {
      isPreviewing = !isPreviewing;
      if (isPreviewing) {
        container.style.width = breakpoint;
        container.style.border = '2px dashed #ff4500';
        previewButton.textContent = 'Exit Preview';
      } else {
        container.style.width = '';
        container.style.border = '';
        previewButton.textContent = `Preview ${breakpoint}`;
      }
      Flexor.refresh(); // Reapply styles for stacking
    });
  });
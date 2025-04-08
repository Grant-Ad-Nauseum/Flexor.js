Flexor.registerPlugin('aspect-ratio', (container, config) => {
  Array.from(container.children).forEach(child => {
    child.style.aspectRatio = '1 / 1'; // Set 1:1 aspect ratio via CSS
    // No ResizeObserver needed; CSS handles height based on width
  });
});

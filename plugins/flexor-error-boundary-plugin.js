Flexor.registerPlugin('error-boundary', (container, config) => {
    const children = Array.from(container.children);
    children.forEach(child => {
      const wrapper = document.createElement('div');
      wrapper.style.flex = child.style.flex || '1 1 0';
      child.parentNode.insertBefore(wrapper, child);
      wrapper.appendChild(child);
  
      const checkContent = () => {
        const imgs = child.querySelectorAll('img');
        imgs.forEach(img => {
          img.onerror = () => {
            wrapper.innerHTML = '<div style="background: #ffe6e6; padding: 10px;">Image failed to load</div>';
          };
        });
      };
  
      checkContent();
      const observer = new MutationObserver(checkContent);
      observer.observe(child, { childList: true, subtree: true });
    });
  });
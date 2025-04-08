Flexor.registerPlugin('lazy-load', (container, config) => {
    const children = Array.from(container.children);
    children.forEach(child => {
      // Identify loadable elements (e.g., images, iframes)
      const loadables = child.querySelectorAll('img, iframe');
      if (loadables.length === 0) return;
  
      // Set placeholder styles
      child.style.opacity = '0';
      child.style.transition = 'opacity 0.3s ease';
  
      // Store original sources
      loadables.forEach(el => {
        if (el.tagName === 'IMG') {
          el.dataset.src = el.src;
          el.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw=='; // Tiny placeholder
        } else if (el.tagName === 'IFRAME') {
          el.dataset.src = el.src;
          el.removeAttribute('src');
        }
      });
  
      // Use IntersectionObserver to load when in view
      const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            loadables.forEach(el => {
              if (el.dataset.src) {
                el.src = el.dataset.src;
                delete el.dataset.src;
              }
            });
            child.style.opacity = '1';
            obs.unobserve(child);
          }
        });
      }, { threshold: 0.1 });
  
      observer.observe(child);
    });
  });
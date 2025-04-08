const Flexor = {
    applyTo(container) {
      const config = this.parseConfig(container.getAttribute('data-flexor'));
      container.style.display = 'flex';
      container.style.flexDirection = config.direction || 'row';
      container.style.gap = config.gap || '0';
      if (config.wrap) container.style.flexWrap = 'wrap';
      if (config.proportions) {
        Array.from(container.children).forEach((child, i) => {
          child.style.flex = `${config.proportions[i] || 1} 1 0`;
        });
      }
      if (config.stackAt) {
        const mediaQuery = window.matchMedia(`(max-width: ${config.stackAt})`);
        container.style.flexDirection = mediaQuery.matches ? 'column' : config.direction;
        mediaQuery.addEventListener('change', () => this.applyTo(container));
      }
      if (config.plugins) {
        config.plugins.forEach(plugin => {
          if (this.plugins[plugin]) this.plugins[plugin](container, config);
        });
      }
    },
    parseConfig(attr) {
      const parts = (attr || '').split(' ').filter(Boolean);
      const config = { plugins: [] };
      config.mode = parts.includes('flex') ? 'flex' : null;
      config.direction = parts.includes('row') ? 'row' : parts.includes('col') ? 'column' : 'row';
      config.proportions = parts.filter(p => /^\d+$/.test(p));
      config.gap = parts.find(p => p.startsWith('gap-'))?.replace('gap-', '');
      config.stackAt = parts.find(p => p.startsWith('stack-'))?.replace('stack-', '');
      config.wrap = parts.includes('wrap');
      config.plugins = parts.filter(p => this.plugins[p]);
      return config;
    },
    plugins: {},
    registerPlugin(name, fn) {
      this.plugins[name] = fn;
    }
  };
  
  // 1. Nested Layouts
  Flexor.registerPlugin('nested-layouts', (container, config) => {
    const nestedContainers = container.querySelectorAll('[data-flexor]');
    nestedContainers.forEach(nested => {
      if (nested !== container) Flexor.applyTo(nested);
    });
  });
  
  // 2. Resize Observer
  Flexor.registerPlugin('resize-observer', (container, config) => {
    const observer = new ResizeObserver(() => {
      const width = container.offsetWidth;
      const children = Array.from(container.children);
      if (width < 400 && config.direction === 'row') {
        container.style.flexDirection = 'column';
        children.forEach(child => child.style.flex = 'auto');
      } else {
        container.style.flexDirection = config.direction;
        config.proportions.forEach((prop, i) => {
          if (children[i]) children[i].style.flex = `${prop} 1 0`;
        });
      }
    });
    observer.observe(container);
  });
  
  // 3. Virtual Scroll
  Flexor.registerPlugin('virtual-scroll', (container, config) => {
    const itemHeight = 50;
    const visibleItems = Math.ceil(container.offsetHeight / itemHeight) + 2;
    const totalItems = 100;
    let startIndex = 0;
  
    container.style.overflowY = 'auto';
    container.style.height = '200px';
    container.style.position = 'relative';
  
    const renderItems = () => {
      container.innerHTML = '';
      const endIndex = Math.min(startIndex + visibleItems, totalItems);
      for (let i = startIndex; i < endIndex; i++) {
        const item = document.createElement('div');
        item.textContent = `Item ${i + 1}`;
        item.style.height = `${itemHeight}px`;
        item.style.background = i % 2 ? '#eee' : '#fff';
        item.style.position = 'absolute';
        item.style.top = `${i * itemHeight}px`;
        item.style.width = '100%';
        container.appendChild(item);
      }
      container.style.height = `${totalItems * itemHeight}px`;
    };
  
    container.addEventListener('scroll', () => {
      startIndex = Math.floor(container.scrollTop / itemHeight);
      renderItems();
    });
    renderItems();
  });
  
  // 4. Layout Transition
  Flexor.registerPlugin('layout-transition', (container, config) => {
    container.style.transition = 'all 0.3s ease-in-out';
    const observer = new MutationObserver(() => {
      container.style.transition = 'all 0.3s ease-in-out';
    });
    observer.observe(container, { attributes: true, childList: true, subtree: true });
  });
  
  // 5. Equal Heights
  Flexor.registerPlugin('equal-heights', (container, config) => {
    const children = Array.from(container.children);
    const resizeObserver = new ResizeObserver(() => {
      const maxHeight = Math.max(...children.map(child => child.scrollHeight));
      children.forEach(child => child.style.height = `${maxHeight}px`);
    });
    resizeObserver.observe(container);
    children.forEach(child => resizeObserver.observe(child));
  });
  
  // 6. Infinite Scroll
  Flexor.registerPlugin('infinite-scroll', (container, config) => {
    let itemCount = container.children.length;
    container.style.overflowY = 'auto';
    container.style.height = '200px';
    container.addEventListener('scroll', () => {
      if (container.scrollTop + container.clientHeight >= container.scrollHeight - 50) {
        for (let i = 0; i < 5; i++) {
          const newItem = document.createElement('div');
          newItem.className = 'demo-item';
          newItem.textContent = `Item ${++itemCount}`;
          newItem.style.background = `hsl(${itemCount % 360}, 70%, 80%)`;
          container.appendChild(newItem);
        }
      }
    });
  });
  
  // 7. Accessibility Boost
  Flexor.registerPlugin('accessibility-boost', (container, config) => {
    container.setAttribute('role', 'region');
    container.setAttribute('aria-label', 'Flexor layout');
    const children = Array.from(container.children);
    children.forEach((child, i) => {
      child.setAttribute('aria-label', `Item ${i + 1}`);
      child.tabIndex = 0;
      child.addEventListener('keydown', e => {
        if (e.key === 'Enter') child.click();
      });
    });
  });
  
  // 8. Content Fit
  Flexor.registerPlugin('content-fit', (container, config) => {
    const resizeObserver = new ResizeObserver(() => {
      const maxWidth = Math.max(...Array.from(container.children).map(c => c.scrollWidth));
      const maxHeight = Math.max(...Array.from(container.children).map(c => c.scrollHeight));
      container.style.width = `${maxWidth}px`;
      container.style.height = `${maxHeight}px`;
    });
    resizeObserver.observe(container);
  });
  
  // 9. Auto Columns
  Flexor.registerPlugin('auto-columns', (container, config) => {
    container.style.flexWrap = 'wrap';
    container.style.maxWidth = '600px';
    const observer = new ResizeObserver(() => {
      const width = container.offsetWidth;
      const colCount = Math.floor(width / 150);
      Array.from(container.children).forEach(child => {
        child.style.flex = `1 1 ${width / colCount - parseInt(config.gap || 0)}px`;
      });
    });
    observer.observe(container);
  });
  
  // 10. Drag and Drop
  Flexor.registerPlugin('drag-and-drop', (container, config) => {
    const children = Array.from(container.children);
    children.forEach(child => {
      child.draggable = true;
      child.addEventListener('dragstart', e => e.dataTransfer.setData('text/plain', child.dataset.index));
    });
    container.addEventListener('dragover', e => e.preventDefault());
    container.addEventListener('drop', e => {
      e.preventDefault();
      const fromIndex = e.dataTransfer.getData('text/plain');
      const toIndex = Array.from(container.children).indexOf(e.target.closest('.demo-item'));
      if (fromIndex !== toIndex && toIndex !== -1) {
        container.insertBefore(children[fromIndex], children[toIndex]);
      }
    });
    children.forEach((child, i) => child.dataset.index = i);
  });
  
  // 11. Lazy Load
  Flexor.registerPlugin('lazy-load', (container, config) => {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = 1;
          entry.target.style.transform = 'translateY(0)';
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    Array.from(container.children).forEach(child => {
      child.style.opacity = 0;
      child.style.transform = 'translateY(20px)';
      child.style.transition = 'opacity 0.5s, transform 0.5s';
      observer.observe(child);
    });
  });
  
  // 12. Dynamic Spacing
  Flexor.registerPlugin('dynamic-spacing', (container, config) => {
    const observer = new ResizeObserver(() => {
      const width = container.offsetWidth;
      const dynamicGap = Math.min(width / 50, 20);
      container.style.gap = `${dynamicGap}px`;
    });
    observer.observe(container);
  });
  
  // 13. Breakpoint Preview
  Flexor.registerPlugin('breakpoint-preview', (container, config) => {
    const breakpoints = { sm: 600, md: 900, lg: 1200 };
    const updateBorder = () => {
      const width = container.offsetWidth;
      container.style.borderColor = width < breakpoints.sm ? 'red' : width < breakpoints.md ? 'orange' : width < breakpoints.lg ? 'yellow' : 'green';
    };
    window.addEventListener('resize', updateBorder);
    updateBorder();
  });
  
  // 14. Aspect Ratio
  Flexor.registerPlugin('aspect-ratio', (container, config) => {
    Array.from(container.children).forEach(child => {
      child.style.aspectRatio = '1 / 1';
      const observer = new ResizeObserver(() => {
        child.style.height = `${child.offsetWidth}px`;
      });
      observer.observe(child);
    });
  });
  
  // 15. Conditional Visibility
  Flexor.registerPlugin('conditional-visibility', (container, config) => {
    const observer = new ResizeObserver(() => {
      container.style.display = container.offsetWidth < 300 ? 'none' : 'flex';
    });
    observer.observe(container);
  });
  
  // 16. Overflow Scroll
  Flexor.registerPlugin('overflow-scroll', (container, config) => {
    container.style.overflowX = 'auto';
    container.style.whiteSpace = 'nowrap';
    Array.from(container.children).forEach(child => child.style.display = 'inline-block');
  });
  
  // 17. Content Alignment
  Flexor.registerPlugin('content-alignment', (container, config) => {
    container.style.justifyContent = 'center';
    container.style.alignItems = 'center';
  });
  
  // 18. Sticky
  Flexor.registerPlugin('sticky', (container, config) => {
    container.style.position = 'sticky';
    container.style.top = '0';
    container.style.zIndex = '10';
  });
  
  // 19. Sticky Headers
  Flexor.registerPlugin('sticky-headers', (container, config) => {
    const firstChild = container.children[0];
    if (firstChild) {
      firstChild.style.position = 'sticky';
      firstChild.style.top = '0';
      firstChild.style.background = '#eee';
      firstChild.style.zIndex = '5';
    }
  });
  
  // 20. Gap Fill
  Flexor.registerPlugin('gap-fill', (container, config) => {
    container.style.gap = '0';
    Array.from(container.children).forEach(child => {
      child.style.margin = `${parseInt(config.gap || 10) / 2}px`;
    });
  });
  
  // 21. Order Switch
  Flexor.registerPlugin('order-switch', (container, config) => {
    Array.from(container.children).forEach((child, i) => {
      child.style.order = i % 2 ? -1 : 0;
    });
  });
  
  // 22. Scroll Reveal
  Flexor.registerPlugin('scroll-reveal', (container, config) => {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.transform = 'translateY(0)';
          entry.target.style.opacity = '1';
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    Array.from(container.children).forEach(child => {
      child.style.transform = 'translateY(50px)';
      child.style.opacity = '0';
      child.style.transition = 'transform 0.5s, opacity 0.5s';
      observer.observe(child);
    });
  });
  
  // 23. Animation
  Flexor.registerPlugin('animation', (container, config) => {
    Array.from(container.children).forEach(child => {
      child.animate([
        { transform: 'scale(1)', opacity: 1 },
        { transform: 'scale(1.1)', opacity: 0.8 },
        { transform: 'scale(1)', opacity: 1 }
      ], { duration: 1000, iterations: Infinity });
    });
  });
  
  // 24. Masonry
  Flexor.registerPlugin('masonry', (container, config) => {
    container.style.display = 'grid';
    container.style.gridTemplateColumns = 'repeat(auto-fill, minmax(100px, 1fr))';
    container.style.gap = config.gap || '10px';
  });
  
  // 25. Focus Trap
  Flexor.registerPlugin('focus-trap', (container, config) => {
    const focusable = Array.from(container.querySelectorAll('a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])'));
    if (focusable.length) {
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      container.addEventListener('keydown', e => {
        if (e.key === 'Tab') {
          if (e.shiftKey && document.activeElement === first) {
            e.preventDefault();
            last.focus();
          } else if (!e.shiftKey && document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      });
    }
  });
  
  // 26. Data Binding
  Flexor.registerPlugin('data-binding', (container, config) => {
    container.dataset.value = 'bound';
    Array.from(container.children).forEach(child => {
      child.textContent = container.dataset.value;
      new MutationObserver(() => child.textContent = container.dataset.value)
        .observe(container, { attributes: true });
    });
  });
  
  // 27. Snap Grid
  Flexor.registerPlugin('snap-grid', (container, config) => {
    container.style.overflowX = 'auto';
    container.style.scrollSnapType = 'x mandatory';
    Array.from(container.children).forEach(child => {
      child.style.scrollSnapAlign = 'start';
      child.style.minWidth = '100px';
    });
  });
  
  // 28. Load Balance
  Flexor.registerPlugin('load-balance', (container, config) => {
    container.style.display = 'grid';
    container.style.gridAutoFlow = 'dense';
    container.style.gridTemplateColumns = 'repeat(auto-fill, minmax(150px, 1fr))';
  });
  
  // 29. RTL Support
  Flexor.registerPlugin('rtl-support', (container, config) => {
    container.style.direction = 'rtl';
    container.style.textAlign = 'right';
  });
  
  // 30. Theme Switch
  Flexor.registerPlugin('theme-switch', (container, config) => {
    const toggle = document.createElement('button');
    toggle.textContent = 'Toggle Theme';
    toggle.style.position = 'absolute';
    toggle.style.top = '5px';
    toggle.style.right = '5px';
    container.style.position = 'relative';
    container.appendChild(toggle);
    let isDark = false;
    toggle.addEventListener('click', () => {
      isDark = !isDark;
      container.style.background = isDark ? '#333' : '#fff';
      container.style.color = isDark ? '#fff' : '#000';
    });
  });
  
  // 31. Error Boundary
  Flexor.registerPlugin('error-boundary', (container, config) => {
    try {
      Flexor.applyTo(container);
    } catch (e) {
      container.innerHTML = `<div style="color: red; padding: 10px;">Error: ${e.message}</div>`;
    }
  });
  
  // 32. Print Styles
  Flexor.registerPlugin('print-styles', (container, config) => {
    const style = document.createElement('style');
    style.textContent = `@media print { #${container.id || 'demo-container'} { flex-direction: column; gap: 10px; } }`;
    document.head.appendChild(style);
  });
  
  // 33. Undo Redo
  Flexor.registerPlugin('undo-redo', (container, config) => {
    let history = [container.innerHTML];
    let historyIndex = 0;
    container.addEventListener('DOMSubtreeModified', () => {
      if (history[historyIndex] !== container.innerHTML) {
        history = history.slice(0, historyIndex + 1);
        history.push(container.innerHTML);
        historyIndex++;
      }
    });
    document.addEventListener('keydown', e => {
      if (e.ctrlKey && e.key === 'z' && historyIndex > 0) {
        historyIndex--;
        container.innerHTML = history[historyIndex];
      } else if (e.ctrlKey && e.key === 'y' && historyIndex < history.length - 1) {
        historyIndex++;
        container.innerHTML = history[historyIndex];
      }
    });
  });
  
  // 34. Layout Presets
  Flexor.registerPlugin('layout-presets', (container, config) => {
    const preset = document.createElement('select');
    preset.innerHTML = `
      <option value="flex row gap-10px">Row Standard</option>
      <option value="flex col gap-20px">Column Stack</option>
      <option value="flex row wrap gap-15px">Wrapped Grid</option>
    `;
    preset.style.position = 'absolute';
    preset.style.top = '5px';
    preset.style.left = '5px';
    container.style.position = 'relative';
    container.appendChild(preset);
    preset.addEventListener('change', () => {
      container.setAttribute('data-flexor', preset.value);
      Flexor.applyTo(container);
    });
  });
  
  // 35. Parallax
  Flexor.registerPlugin('parallax', (container, config) => {
    container.style.overflowY = 'auto';
    container.style.height = '200px';
    window.addEventListener('scroll', () => {
      Array.from(container.children).forEach(child => {
        const speed = 0.5;
        const yPos = -(window.scrollY * speed);
        child.style.transform = `translateY(${yPos}px)`;
      });
    });
  });
  
  // 36. Voice Control
  Flexor.registerPlugin('voice-control', (container, config) => {
    if ('webkitSpeechRecognition' in window) {
      const recognition = new webkitSpeechRecognition();
      recognition.continuous = true;
      recognition.onresult = event => {
        const command = event.results[event.results.length - 1][0].transcript.toLowerCase();
        if (command.includes('row')) container.setAttribute('data-flexor', 'flex row gap-10px');
        if (command.includes('column')) container.setAttribute('data-flexor', 'flex col gap-10px');
        Flexor.applyTo(container);
      };
      recognition.start();
    }
  });
  
  // 37. Responsive Text
  Flexor.registerPlugin('responsive-text', (container, config) => {
    const observer = new ResizeObserver(() => {
      const width = container.offsetWidth;
      const fontSize = Math.max(12, Math.min(24, width / 20));
      Array.from(container.children).forEach(child => {
        child.style.fontSize = `${fontSize}px`;
      });
    });
    observer.observe(container);
  });
  
  // 38. Hover Effects
  Flexor.registerPlugin('hover-effects', (container, config) => {
    Array.from(container.children).forEach(child => {
      child.style.transition = 'transform 0.3s';
      child.addEventListener('mouseenter', () => child.style.transform = 'scale(1.1)');
      child.addEventListener('mouseleave', () => child.style.transform = 'scale(1)');
    });
  });
  
  // 39. Background Switch
  Flexor.registerPlugin('background-switch', (container, config) => {
    const colors = ['#f0f0f0', '#e0e0ff', '#ffe0e0', '#e0ffe0'];
    let index = 0;
    container.addEventListener('click', () => {
      index = (index + 1) % colors.length;
      container.style.background = colors[index];
    });
  });
  
  // 40. Collaborative Edit
  Flexor.registerPlugin('collaborative-edit', (container, config) => {
    let socket;
    if (typeof WebSocket !== 'undefined') {
      socket = new WebSocket('wss://example.com/flexor-collab'); // Replace with real server if needed
      socket.onmessage = event => {
        container.innerHTML = event.data;
        Flexor.applyTo(container);
      };
      container.addEventListener('input', () => {
        socket.send(container.innerHTML);
      });
    }
  });
  
  // 41. Breakpoint Sync
  Flexor.registerPlugin('breakpoint-sync', (container, config) => {
    const updateBreakpoints = () => {
      const rootStyles = getComputedStyle(document.documentElement);
      const sm = rootStyles.getPropertyValue('--breakpoint-sm') || '600px';
      if (window.matchMedia(`(max-width: ${sm})`).matches) {
        container.style.flexDirection = 'column';
      } else {
        container.style.flexDirection = config.direction;
      }
    };
    window.addEventListener('resize', updateBreakpoints);
    updateBreakpoints();
  });
  
  // 42. Layout Debug
  Flexor.registerPlugin('layout-debug', (container, config) => {
    document.addEventListener('keydown', e => {
      if (e.ctrlKey && e.key === 'd') {
        container.style.outline = container.style.outline ? '' : '2px solid red';
        Array.from(container.children).forEach(child => {
          child.style.outline = child.style.outline ? '' : '1px dashed blue';
        });
      }
    });
  });
  
  // 43. Container Queries
  Flexor.registerPlugin('container-queries', (container, config) => {
    container.style.containerType = 'inline-size';
    const style = document.createElement('style');
    style.textContent = `
      @container (max-width: 300px) {
        #${container.id || 'demo-container'} {
          flex-direction: column;
        }
      }
    `;
    document.head.appendChild(style);
  });
  
  // 44. Perf Monitor
  Flexor.registerPlugin('perf-monitor', (container, config) => {
    const start = performance.now();
    Flexor.applyTo(container);
    const end = performance.now();
    const perfDiv = document.createElement('div');
    perfDiv.textContent = `Render time: ${end - start}ms`;
    perfDiv.style.position = 'absolute';
    perfDiv.style.top = '5px';
    perfDiv.style.right = '5px';
    container.style.position = 'relative';
    container.appendChild(perfDiv);
  });
  
  // 45. State Manager
  Flexor.registerPlugin('state-manager', (container, config) => {
    const saveState = () => localStorage.setItem('flexor-state', container.innerHTML);
    const loadState = () => {
      const saved = localStorage.getItem('flexor-state');
      if (saved) container.innerHTML = saved;
    };
    container.addEventListener('change', saveState);
    container.addEventListener('DOMSubtreeModified', saveState);
    loadState();
  });
  
  // 46. Offline Cache
  Flexor.registerPlugin('offline-cache', (container, config) => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/flexor-sw.js').then(reg => {
        const cacheName = 'flexor-cache-v1';
        const urlsToCache = [location.href];
        reg.addEventListener('install', event => {
          event.waitUntil(caches.open(cacheName).then(cache => cache.addAll(urlsToCache)));
        });
      });
      window.addEventListener('offline', () => {
        container.innerHTML = '<div style="padding: 10px; background: #ffeeee;">Offline Mode</div>';
      });
    }
  });
  
  // 47. Motion Path
  Flexor.registerPlugin('motion-path', (container, config) => {
    const children = Array.from(container.children);
    children.forEach(child => {
      child.animate([
        { offsetDistance: '0%', offsetPath: 'path("M 0 0 Q 100 200 200 0")' },
        { offsetDistance: '100%', offsetPath: 'path("M 0 0 Q 100 200 200 0")' }
      ], { duration: 2000, iterations: Infinity, easing: 'ease-in-out' });
      child.style.offsetPath = 'path("M 0 0 Q 100 200 200 0")';
      child.style.position = 'absolute';
    });
    container.style.position = 'relative';
    container.style.height = '200px';
  });
  
  // 48. SSR Prep
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
    Flexor.applyTo(container);
  });
  
  // 49. AI Layout
  Flexor.registerPlugin('ai-layout', (container, config) => {
    const children = Array.from(container.children);
    const updateLayout = () => {
      const weights = children.map(child => {
        const textLength = child.textContent.length;
        const imgArea = child.querySelector('img')?.width * child.querySelector('img')?.height || 0;
        return Math.max(textLength / 100, imgArea / 10000, 1);
      });
      const totalWeight = weights.reduce((a, b) => a + b, 0);
      children.forEach((child, i) => {
        child.style.flex = `${weights[i] / totalWeight * 10} 1 0`;
      });
      const width = container.offsetWidth;
      container.style.flexDirection = width < 400 ? 'column' : config.direction;
    };
    updateLayout();
    window.addEventListener('resize', updateLayout);
    new MutationObserver(updateLayout).observe(container, { childList: true, subtree: true });
  });
  
  // 50. Component Export
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
  
  // Apply Flexor to all containers
  document.querySelectorAll('[data-flexor]').forEach(container => Flexor.applyTo(container));
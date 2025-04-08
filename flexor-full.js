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
  
  Flexor.registerPlugin('nested-layouts', (container, config) => {
    const nestedContainers = container.querySelectorAll('[data-flexor]');
    nestedContainers.forEach(nested => {
      if (nested !== container) Flexor.applyTo(nested);
    });
  });
  
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
  
  Flexor.registerPlugin('virtual-scroll', (container, config) => {
    const itemHeight = 50;
    const visibleItems = Math.ceil(container.offsetHeight / itemHeight) + 2;
    const totalItems = 100;
    let startIndex = 0;
    let virtualContainer = container.querySelector('.virtual-scroll-container');

    if (!virtualContainer) {
      virtualContainer = document.createElement('div');
      virtualContainer.className = 'virtual-scroll-container';
      virtualContainer.style.position = 'relative';
      virtualContainer.style.height = `${totalItems * itemHeight}px`;
      container.appendChild(virtualContainer);
    }

    container.style.overflowY = 'auto';

    const renderItems = () => {
      virtualContainer.innerHTML = '';
      const endIndex = Math.min(startIndex + visibleItems, totalItems);
      for (let i = startIndex; i < endIndex; i++) {
        const item = document.createElement('div');
        item.textContent = `Virtual Item ${i + 1}`;
        item.style.height = `${itemHeight}px`;
        item.style.background = i % 2 ? '#eee' : '#fff';
        item.style.position = 'absolute';
        item.style.top = `${i * itemHeight}px`;
        item.style.width = '100%';
        virtualContainer.appendChild(item);
      }
    };

    const scrollHandler = () => {
      startIndex = Math.floor(container.scrollTop / itemHeight);
      renderItems();
    };

    container.addEventListener('scroll', scrollHandler);
    renderItems();
  });
  
  Flexor.registerPlugin('layout-transition', (container, config) => {
    container.style.transition = 'all 0.3s ease-in-out';
    const observer = new MutationObserver(() => {
      container.style.transition = 'all 0.3s ease-in-out';
    });
    observer.observe(container, { attributes: true, childList: true, subtree: true });
  });
  
  Flexor.registerPlugin('equal-heights', (container, config) => {
    const children = Array.from(container.children);
    
    const sandbox = document.createElement('div');
    sandbox.style.position = 'absolute';
    sandbox.style.visibility = 'hidden';
    sandbox.style.display = 'block';
    document.body.appendChild(sandbox);
    
    const clones = children.map(child => {
      const clone = child.cloneNode(true);
      clone.style.height = 'auto';
      clone.style.flex = 'none';
      clone.style.display = 'block';
      sandbox.appendChild(clone);
      return clone;
    });
    const naturalHeights = clones.map(clone => clone.getBoundingClientRect().height);
    const maxHeight = Math.max(...naturalHeights);
    sandbox.remove();
    
    children.forEach((child, i) => {
      child.style.height = `${maxHeight}px`;
      child.style.minHeight = `${maxHeight}px`;
      child.style.maxHeight = `${maxHeight}px`;
      child.style.flex = config.proportions 
        ? `${config.proportions[i] || 1} 0 ${maxHeight}px`
        : `1 0 ${maxHeight}px`;
      child.style.boxSizing = 'border-box';
    });
    
    const styleId = `equal-heights-fix-${container.id || 'demo-container'}`;
    let style = document.getElementById(styleId);
    if (!style) {
      style = document.createElement('style');
      style.id = styleId;
      document.head.appendChild(style);
    }
    style.textContent = `
      #${container.id || 'demo-container'} > .demo-item {
        height: ${maxHeight}px !important;
        min-height: ${maxHeight}px !important;
        max-height: ${maxHeight}px !important;
        flex-grow: 0 !important;
        flex-shrink: 0 !important;
      }
    `;
  });

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
  
  Flexor.registerPlugin('content-fit', (container, config) => {
    const resizeObserver = new ResizeObserver(() => {
      const maxWidth = Math.max(...Array.from(container.children).map(c => c.scrollWidth));
      const maxHeight = Math.max(...Array.from(container.children).map(c => c.scrollHeight));
      container.style.width = `${maxWidth}px`;
      container.style.height = `${maxHeight}px`;
    });
    resizeObserver.observe(container);
  });
  
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
  
  Flexor.registerPlugin('dynamic-spacing', (container, config) => {
    const observer = new ResizeObserver(() => {
      const width = container.offsetWidth;
      const dynamicGap = Math.min(width / 50, 20);
      container.style.gap = `${dynamicGap}px`;
    });
    observer.observe(container);
  });
  
  Flexor.registerPlugin('breakpoint-preview', (container, config) => {
    const breakpoints = { sm: 600, md: 900, lg: 1200 };
    const updateBorder = () => {
      const width = container.offsetWidth;
      container.style.borderColor = width < breakpoints.sm ? 'red' : width < breakpoints.md ? 'orange' : width < breakpoints.lg ? 'yellow' : 'green';
    };
    window.addEventListener('resize', updateBorder);
    updateBorder();
  });
  
  Flexor.registerPlugin('aspect-ratio', (container, config) => {
    Array.from(container.children).forEach(child => {
      child.style.aspectRatio = '1 / 1';
    });
  });
  
  Flexor.registerPlugin('conditional-visibility', (container, config) => {
    const observer = new ResizeObserver(() => {
      container.style.display = container.offsetWidth < 300 ? 'none' : 'flex';
    });
    observer.observe(container);
  });
  
  Flexor.registerPlugin('overflow-scroll', (container, config) => {
    container.style.overflowX = 'auto';
    container.style.whiteSpace = 'nowrap';
    Array.from(container.children).forEach(child => child.style.display = 'inline-block');
  });
  
  Flexor.registerPlugin('content-alignment', (container, config) => {
    container.style.justifyContent = 'center';
    container.style.alignItems = 'center';
  });
  
  Flexor.registerPlugin('sticky', (container, config) => {
    container.style.position = 'sticky';
    container.style.top = '0';
    container.style.zIndex = '10';
  });
  
  Flexor.registerPlugin('sticky-headers', (container, config) => {
    const firstChild = container.children[0];
    if (firstChild) {
      firstChild.style.position = 'sticky';
      firstChild.style.top = '0';
      firstChild.style.background = '#eee';
      firstChild.style.zIndex = '5';
    }
  });
  
  Flexor.registerPlugin('gap-fill', (container, config) => {
    container.style.gap = '0';
    Array.from(container.children).forEach(child => {
      child.style.margin = `${parseInt(config.gap || 10) / 2}px`;
    });
  });
  
  Flexor.registerPlugin('order-switch', (container, config) => {
    Array.from(container.children).forEach((child, i) => {
      child.style.order = i % 2 ? -1 : 0;
    });
  });
  
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
  
  Flexor.registerPlugin('animation', (container, config) => {
    Array.from(container.children).forEach(child => {
      child.animate([
        { transform: 'scale(1)', opacity: 1 },
        { transform: 'scale(1.1)', opacity: 0.8 },
        { transform: 'scale(1)', opacity: 1 }
      ], { duration: 1000, iterations: Infinity });
    });
  });
  
  Flexor.registerPlugin('masonry', (container, config) => {
    container.style.display = 'grid';
    container.style.gridTemplateColumns = 'repeat(auto-fill, minmax(100px, 1fr))';
    container.style.gap = config.gap || '10px';
  });
  
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
  
  Flexor.registerPlugin('data-binding', (container, config) => {
    container.dataset.value = 'bound';
    Array.from(container.children).forEach(child => {
      child.textContent = container.dataset.value;
      new MutationObserver(() => child.textContent = container.dataset.value)
        .observe(container, { attributes: true });
    });
  });
  
  Flexor.registerPlugin('snap-grid', (container, config) => {
    container.style.overflowX = 'auto';
    container.style.scrollSnapType = 'x mandatory';
    Array.from(container.children).forEach(child => {
      child.style.scrollSnapAlign = 'start';
      child.style.minWidth = '100px';
    });
  });
  
  Flexor.registerPlugin('load-balance', (container, config) => {
    container.style.display = 'grid';
    container.style.gridAutoFlow = 'dense';
    container.style.gridTemplateColumns = 'repeat(auto-fill, minmax(150px, 1fr))';
  });
  
  Flexor.registerPlugin('rtl-support', (container, config) => {
    container.style.direction = 'rtl';
    container.style.textAlign = 'right';
  });
  
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
  
  Flexor.registerPlugin('error-boundary', (container, config) => {
    try {
      Flexor.applyTo(container);
    } catch (e) {
      container.innerHTML = `<div style="color: red; padding: 10px;">Error: ${e.message}</div>`;
    }
  });
  
  Flexor.registerPlugin('print-styles', (container, config) => {
    const style = document.createElement('style');
    style.textContent = `@media print { #${container.id || 'demo-container'} { flex-direction: column; gap: 10px; } }`;
    document.head.appendChild(style);
  });
  
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
  
  Flexor.registerPlugin('hover-effects', (container, config) => {
    Array.from(container.children).forEach(child => {
      child.style.transition = 'transform 0.3s';
      child.addEventListener('mouseenter', () => child.style.transform = 'scale(1.1)');
      child.addEventListener('mouseleave', () => child.style.transform = 'scale(1)');
    });
  });
  
  Flexor.registerPlugin('background-switch', (container, config) => {
    const colors = ['#f0f0f0', '#e0e0ff', '#ffe0e0', '#e0ffe0'];
    let index = 0;
    container.addEventListener('click', () => {
      index = (index + 1) % colors.length;
      container.style.background = colors[index];
    });
  });
  
  Flexor.registerPlugin('collaborative-edit', (container, config) => {
    let socket;
    if (typeof WebSocket !== 'undefined') {
      socket = new WebSocket('wss://example.com/flexor-collab');
      socket.onmessage = event => {
        container.innerHTML = event.data;
        Flexor.applyTo(container);
      };
      container.addEventListener('input', () => {
        socket.send(container.innerHTML);
      });
    }
  });
  
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
  
  document.querySelectorAll('[data-flexor]').forEach(container => Flexor.applyTo(container));

Flexor.registerPlugin('breakpoint-sync', (container, config) => {
    const root = document.documentElement;
    const updateBreakpoints = () => {
      const sm = getComputedStyle(root).getPropertyValue('--breakpoint-sm') || '600px';
      const stackAt = config.stackAt === 'sm' ? sm : config.stackAt;
      const mediaQuery = window.matchMedia(`(max-width: ${stackAt})`);
      container.style.flexDirection = mediaQuery.matches ? 'column' : config.direction;
      Flexor.applyTo(container);
    };
  
    updateBreakpoints();
    window.addEventListener('resize', updateBreakpoints);
    new MutationObserver(updateBreakpoints).observe(root, { attributes: true, attributeFilter: ['style'] });
  });
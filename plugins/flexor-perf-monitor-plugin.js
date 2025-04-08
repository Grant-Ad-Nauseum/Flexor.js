Flexor.registerPlugin('perf-monitor', (container, config) => {
    const start = performance.now();
    Flexor.applyTo(container);
    const end = performance.now();
    const renderTime = end - start;
    console.log(`Flexor render time: ${renderTime.toFixed(2)}ms`);
  
    const observer = new PerformanceObserver((list) => {
      list.getEntries().forEach(entry => {
        if (entry.entryType === 'layout-shift' && entry.hadRecentInput) {
          console.warn('Layout shift detected in Flexor container:', entry);
        }
      });
    });
    observer.observe({ entryTypes: ['layout-shift'] });
  
    if (renderTime > 50) console.warn('Slow render detected (>50ms)');
  });
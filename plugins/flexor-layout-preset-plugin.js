Flexor.registerPlugin('layout-presets', (container, config) => {
    const presets = {
      hero: { direction: 'col', align: 'center', justify: 'center', gap: '20px', wrap: false },
      sidebar: { direction: 'row', proportions: ['1', '3'], gap: '10px', stackAt: '768px' }
    };
    const presetName = container.dataset.preset || 'hero';
    const preset = presets[presetName];
  
    if (preset) {
      Object.assign(config, preset);
      container.setAttribute('data-flexor', Flexor.generateConfig({ mode: 'flex', ...config }));
      Flexor.applyTo(container);
    }
  });
Flexor.registerPlugin('data-binding', (container, config) => {
    const dataSource = container.dataset.flexorData ? JSON.parse(container.dataset.flexorData) : [];
    const template = container.querySelector('template');
  
    if (!template || !dataSource.length) return;
  
    // Clear existing children except template
    Array.from(container.children).forEach(child => {
      if (child !== template) child.remove();
    });
  
    // Render initial data
    const renderData = () => {
      dataSource.forEach((item, index) => {
        const clone = template.content.cloneNode(true);
        const div = clone.querySelector('div') || document.createElement('div');
        div.textContent = item.name || `Item ${index + 1}`;
        container.appendChild(div);
      });
      Flexor.applyTo(container); // Reapply Flexor styles
    };
  
    renderData();
  
    // Watch for data changes (simplified, assumes dataset updates)
    const observer = new MutationObserver(() => {
      const newData = container.dataset.flexorData ? JSON.parse(container.dataset.flexorData) : [];
      if (JSON.stringify(newData) !== JSON.stringify(dataSource)) {
        dataSource.length = 0;
        dataSource.push(...newData);
        while (container.children.length > 1) container.lastChild.remove();
        renderData();
      }
    });
    observer.observe(container, { attributes: true, attributeFilter: ['data-flexor-data'] });
  });
Flexor.registerPlugin('theme-switch', (container, config) => {
    const toggle = document.createElement('button');
    toggle.textContent = 'Toggle Theme';
    toggle.style.marginBottom = '10px';
    container.prepend(toggle);
  
    const applyTheme = (isDark) => {
      const children = Array.from(container.children).slice(1); // Exclude toggle
      children.forEach(child => {
        child.style.background = isDark ? '#333' : '#fff';
        child.style.color = isDark ? '#fff' : '#000';
      });
    };
  
    let isDark = false;
    toggle.addEventListener('click', () => {
      isDark = !isDark;
      applyTheme(isDark);
    });
  
    applyTheme(isDark); // Initial light theme
  });
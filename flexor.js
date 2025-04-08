const Flexor = {
    // Predefined breakpoints (extendable via plugins or custom values)
    breakpoints: {
      'mobile': '600px',
      'tablet': '768px'
    },
  
    // Alignment and justification options
    alignments: {
      'align-start': 'flex-start',
      'align-center': 'center',
      'align-end': 'flex-end',
      'justify-start': 'flex-start',
      'justify-center': 'center',
      'justify-end': 'flex-end',
      'justify-space-between': 'space-between',
      'justify-space-around': 'space-around',
      'justify-space-evenly': 'space-evenly'
    },
  
    // Plugin registry
    plugins: {},
  
    // Register a plugin
    registerPlugin: function(name, pluginFn) {
      this.plugins[name] = pluginFn;
    },
  
    // Generate data-flexor attribute from a configuration object (for visual editor)
    generateConfig: function(config) {
      const parts = [config.mode || 'flex', config.direction];
      if (config.proportions) parts.push(...config.proportions);
      if (config.gap) parts.push(`gap-${config.gap}`);
      if (config.stackAt) parts.push(`stack-${config.stackAt}`);
      if (config.align) parts.push(`align-${config.align}`);
      if (config.justify) parts.push(`justify-${config.justify}`);
      if (config.wrap) parts.push('wrap');
      if (config.smart) parts.push('smart');
      return parts.join(' ');
    },
  
    // Parse the data-flexor attribute into a config object
    parseConfig: function(parts) {
      const config = {
        direction: parts[0],
        proportions: [],
        gap: '0',
        stackAt: null,
        align: null,
        justify: null,
        wrap: false,
        smart: false
      };
      parts.slice(1).forEach(part => {
        if (part.startsWith('gap-')) {
          config.gap = part.slice(4);
          if (!/[a-zA-Z]/.test(config.gap)) config.gap += 'rem';
        } else if (part.startsWith('stack-')) {
          config.stackAt = part.slice(6);
        } else if (part.startsWith('align-')) {
          config.align = this.alignments[part] || null;
        } else if (part.startsWith('justify-')) {
          config.justify = this.alignments[part] || null;
        } else if (part === 'wrap') {
          config.wrap = true;
        } else if (part === 'smart') {
          config.smart = true;
        } else {
          config.proportions.push(part);
        }
      });
      return config;
    },
  
    // Apply Flexor styles to a single element
    applyTo: function(container) {
      const data = container.getAttribute('data-flexor');
      if (!data) return;
      const parts = data.split(' ');
      const mode = parts[0];
      const config = this.parseConfig(parts.slice(1));
      if (this.modes[mode]) {
        this.modes[mode](container, config);
      }
      // Run registered plugins
      Object.values(this.plugins).forEach(plugin => plugin(container, config));
    },
  
    // Re-apply styles to all Flexor containers
    refresh: function() {
      document.querySelectorAll('[data-flexor]').forEach(container => {
        this.applyTo(container);
      });
    },
  
    // Layout modes (currently only 'flex')
    modes: {
      flex: function(container, config) {
        // Apply container styles
        container.style.display = 'flex';
        container.style.flexDirection = config.direction;
        container.style.gap = config.gap;
        if (config.wrap) container.style.flexWrap = 'wrap';
        if (config.align) container.style.alignItems = config.align;
        if (config.justify) container.style.justifyContent = config.justify;
  
        const children = Array.from(container.children);
  
        if (config.smart) {
          // Smart adaptation: measure natural sizes and adjust flex-grow
          const originalDisplay = container.style.display;
          container.style.display = 'block'; // Temporarily set to block to measure natural sizes
          const sizes = children.map(child => config.direction === 'row' ? child.offsetWidth : child.offsetHeight);
          container.style.display = 'flex'; // Restore flex display
          // Set flex-grow based on measured sizes
          children.forEach((child, index) => {
            child.style.flex = `${sizes[index]} 0 0`;
          });
        } else {
          // Apply static proportions if provided
          config.proportions.forEach((prop, index) => {
            if (index < children.length) {
              children[index].style.flex = `${prop} 1 0`;
            }
          });
        }
  
        // Handle stacking for responsiveness
        if (config.stackAt && config.direction === 'row') {
          const breakpoint = this.breakpoints[config.stackAt] || (config.stackAt.match(/^\d+px$/) ? config.stackAt : null);
          if (breakpoint) {
            const className = `stack-${breakpoint.replace('px', '')}`;
            container.classList.add(className);
            // Add dynamic CSS for custom breakpoints if needed
            if (!this.breakpoints[config.stackAt] && !document.querySelector(`style[data-flexor-stack="${className}"]`)) {
              const style = document.createElement('style');
              style.dataset.flexorStack = className;
              style.textContent = `
                .${className} {
                  @media (max-width: ${breakpoint}) {
                    flex-direction: column !important;
                  }
                  @media (max-width: ${breakpoint}) {
                    > * {
                      flex: auto !important;
                      width: 100% !important;
                    }
                  }
                }
              `;
              document.head.appendChild(style);
            }
          }
        }
      }
    }
  };
  
  // Run Flexor on page load
  window.addEventListener('load', Flexor.refresh);
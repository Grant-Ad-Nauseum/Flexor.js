const availablePlugins = [
  'nested-layouts', 'resize-observer', 'virtual-scroll', 'layout-transition', 'equal-heights',
  'infinite-scroll', 'accessibility-boost', 'content-fit', 'auto-columns', 'drag-and-drop',
  'lazy-load', 'dynamic-spacing', 'breakpoint-preview', 'aspect-ratio', 'conditional-visibility',
  'overflow-scroll', 'content-alignment', 'sticky', 'sticky-headers', 'gap-fill',
  'order-switch', 'scroll-reveal', 'animation', 'masonry', 'focus-trap',
  'data-binding', 'snap-grid', 'load-balance', 'rtl-support', 'theme-switch',
  'error-boundary', 'print-styles', 'undo-redo', 'layout-presets', 'parallax',
  'voice-control', 'responsive-text', 'hover-effects', 'background-switch', 'collaborative-edit',
  'breakpoint-sync', 'layout-debug', 'container-queries', 'perf-monitor', 'state-manager',
  'offline-cache', 'motion-path', 'ssr-prep', 'ai-layout', 'component-export'
];

// Plugin descriptions for tooltips
const pluginDescriptions = {
  'nested-layouts': 'Applies Flexor to nested containers.',
  'resize-observer': 'Stacks items vertically below 400px width.',
  'virtual-scroll': 'Renders a virtualized scrolling list.',
  'layout-transition': 'Adds smooth transitions to layout changes.',
  'equal-heights': 'Sets all children to the tallest height.',
  'infinite-scroll': 'Adds more items as you scroll.',
  'accessibility-boost': 'Enhances accessibility with ARIA roles.',
  'content-fit': 'Sizes container to fit largest child.',
  'auto-columns': 'Creates responsive columns based on width.',
  'drag-and-drop': 'Enables dragging to reorder items.',
  'lazy-load': 'Fades in items as they enter the viewport.',
  'dynamic-spacing': 'Adjusts gap based on container width.',
  'breakpoint-preview': 'Changes border color by width.',
  'aspect-ratio': 'Forces 1:1 aspect ratio on children.',
  'conditional-visibility': 'Hides container below 300px width.',
  'overflow-scroll': 'Enables horizontal scrolling.',
  'content-alignment': 'Centers items horizontally and vertically.',
  'sticky': 'Makes the container sticky at the top.',
  'sticky-headers': 'Sticks the first child as a header.',
  'gap-fill': 'Replaces gap with child margins.',
  'order-switch': 'Reverses order of odd-indexed children.',
  'scroll-reveal': 'Reveals items as they scroll into view.',
  'animation': 'Applies a pulsing scale animation.',
  'masonry': 'Switches to a masonry grid layout.',
  'focus-trap': 'Traps keyboard focus within the container.',
  'data-binding': 'Syncs child text with container data.',
  'snap-grid': 'Enables snap scrolling for children.',
  'load-balance': 'Balances items in a dense grid.',
  'rtl-support': 'Switches to right-to-left layout.',
  'theme-switch': 'Adds a button to toggle themes.',
  'error-boundary': 'Displays errors if layout fails.',
  'print-styles': 'Optimizes layout for printing.',
  'undo-redo': 'Tracks and reverts changes (Ctrl+Z/Y).',
  'layout-presets': 'Adds a dropdown for layout presets.',
  'parallax': 'Applies a parallax scroll effect.',
  'voice-control': 'Changes layout via voice commands.',
  'responsive-text': 'Scales text size with container width.',
  'hover-effects': 'Scales items on hover.',
  'background-switch': 'Cycles background colors on click.',
  'collaborative-edit': 'Enables real-time collaborative editing.',
  'breakpoint-sync': 'Syncs layout with CSS breakpoints.',
  'layout-debug': 'Toggles debug outlines (Ctrl+D).',
  'container-queries': 'Stacks items below 300px container width.',
  'perf-monitor': 'Shows render time in a corner div.',
  'state-manager': 'Saves and restores layout state.',
  'offline-cache': 'Caches content for offline use.',
  'motion-path': 'Animates items along a curved path.',
  'ssr-prep': 'Generates static CSS for server-side rendering.',
  'ai-layout': 'Adjusts layout based on content weight.',
  'component-export': 'Exports the layout to clipboard.'
};

// Initial state
const initialState = {
  direction: 'row',
  gap: '10px',
  proportions: '1 1 1',
  stack: '',
  wrap: false,
  plugins: [],
  html: `
    <div class="demo-item" style="background: #60a5fa;">Item 1</div>
    <div class="demo-item" style="background: #34d399;">Item 2</div>
    <div class="demo-item" style="background: #f87171;">Item 3</div>
  `
};

// Populate plugin checkboxes with tooltips
const pluginList = document.getElementById('plugin-list');
availablePlugins.forEach(plugin => {
  const label = document.createElement('label');
  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.value = plugin;
  checkbox.id = `plugin-${plugin}`;
  label.appendChild(checkbox);
  label.append(` ${plugin}`);
  
  const tooltip = document.createElement('span');
  tooltip.className = 'tooltip';
  tooltip.textContent = pluginDescriptions[plugin] || 'No description available.';
  label.appendChild(tooltip);
  
  pluginList.appendChild(label);
});

// Elements
const demoContainer = document.getElementById('demo-container');
const directionSelect = document.getElementById('direction');
const gapInput = document.getElementById('gap');
const proportionsInput = document.getElementById('proportions');
const stackInput = document.getElementById('stack');
const wrapCheckbox = document.getElementById('wrap');
const configOutput = document.getElementById('config-output');
const clearPluginsBtn = document.getElementById('clear-plugins');

// Reset styles function
function resetStyles(container) {
  container.removeAttribute('style'); // Clear all inline styles
  container.style.display = 'flex'; // Reapply base Flexor styles
  Array.from(container.children).forEach(child => {
    child.removeAttribute('style');
    child.style.background = child.style.background || '#60a5fa'; // Restore initial colors
  });
}

// Update function
function updateDemo() {
  resetStyles(demoContainer); // Reset styles before applying new config
  let config = ['flex', directionSelect.value];
  if (gapInput.value) config.push(`gap-${gapInput.value}`);
  if (proportionsInput.value) config = config.concat(proportionsInput.value.split(' ').filter(Boolean));
  if (stackInput.value) config.push(`stack-${stackInput.value}`);
  if (wrapCheckbox.checked) config.push('wrap');
  const activePlugins = Array.from(document.querySelectorAll('#plugin-list input:checked'))
    .map(cb => cb.value);
  config = config.concat(activePlugins);

  const dataFlexor = config.join(' ');
  demoContainer.setAttribute('data-flexor', dataFlexor);
  configOutput.textContent = `data-flexor="${dataFlexor}"`;
  Flexor.applyTo(demoContainer);
}

// Clear plugins function
function clearPlugins() {
  // Reset inputs to initial values
  directionSelect.value = initialState.direction;
  gapInput.value = initialState.gap;
  proportionsInput.value = initialState.proportions;
  stackInput.value = initialState.stack;
  wrapCheckbox.checked = initialState.wrap;

  // Uncheck all plugins
  document.querySelectorAll('#plugin-list input:checked').forEach(checkbox => {
    checkbox.checked = false;
  });

  // Reset demo container
  demoContainer.innerHTML = initialState.html;
  resetStyles(demoContainer);
  demoContainer.setAttribute('data-flexor', 'flex row gap-10px');
  
  // Reapply Flexor with initial state
  Flexor.applyTo(demoContainer);
  configOutput.textContent = `data-flexor="flex row gap-10px"`;
}

// Event listeners
[directionSelect, gapInput, proportionsInput, stackInput, wrapCheckbox].forEach(el => {
  el.addEventListener('change', updateDemo);
});
pluginList.addEventListener('change', updateDemo);
clearPluginsBtn.addEventListener('click', clearPlugins);

// Initial update
updateDemo();

const availablePlugins = [
  'drag-and-drop', 'hover-effects', 'animation', 'resize-observer', 'layout-transition',
  'infinite-scroll', 'lazy-load', 'scroll-reveal', 'masonry', 'auto-columns',
  'dynamic-spacing', 'breakpoint-preview', 'theme-switch', 'background-switch', 'responsive-text',
  'nested-layouts', 'content-alignment', 'gap-fill', 'order-switch', 'load-balance',
  'rtl-support', 'layout-presets', 'parallax',
  'equal-heights', 'virtual-scroll', 'content-fit', 'aspect-ratio', 'snap-grid',
  'sticky', 'sticky-headers', 'conditional-visibility', 'overflow-scroll', 'focus-trap',
  'data-binding', 'print-styles', 'breakpoint-sync', 'container-queries', 'motion-path',
  'ai-layout', 'component-export', 'accessibility-boost', 'error-boundary', 'perf-monitor',
  'state-manager', 'undo-redo', 'voice-control', 'collaborative-edit', 'offline-cache',
  'ssr-prep', 'layout-debug'
];

const pluginDescriptions = {
  'drag-and-drop': 'Enables dragging to reorder items.',
  'hover-effects': 'Scales items on hover.',
  'animation': 'Applies a pulsing scale animation.',
  'resize-observer': 'Stacks items vertically below 400px width.',
  'layout-transition': 'Adds smooth transitions to layout changes.',
  'infinite-scroll': 'Adds more items as you scroll.',
  'lazy-load': 'Fades in items as they enter the viewport.',
  'scroll-reveal': 'Reveals items as they scroll into view.',
  'masonry': 'Switches to a masonry grid layout.',
  'auto-columns': 'Creates responsive columns based on width.',
  'dynamic-spacing': 'Adjusts gap based on container width.',
  'breakpoint-preview': 'Changes border color by width.',
  'theme-switch': 'Adds a button to toggle themes.',
  'background-switch': 'Cycles background colors on click.',
  'responsive-text': 'Scales text size with container width.',
  'nested-layouts': 'Applies Flexor to nested containers.',
  'content-alignment': 'Centers items horizontally and vertically.',
  'gap-fill': 'Replaces gap with child margins.',
  'order-switch': 'Reverses order of odd-indexed children.',
  'load-balance': 'Balances items in a dense grid.',
  'rtl-support': 'Switches to right-to-left layout.',
  'layout-presets': 'Adds a dropdown for layout presets.',
  'parallax': 'Applies a parallax scroll effect.',
  'equal-heights': 'Sets all children to the tallest height.',
  'virtual-scroll': 'Renders a virtualized scrolling list.',
  'content-fit': 'Sizes container to fit largest child.',
  'aspect-ratio': 'Forces 1:1 aspect ratio on children.',
  'snap-grid': 'Enables snap scrolling for children.',
  'sticky': 'Makes the container sticky at the top.',
  'sticky-headers': 'Sticks the first child as a header.',
  'conditional-visibility': 'Hides container below 300px width.',
  'overflow-scroll': 'Enables horizontal scrolling.',
  'focus-trap': 'Traps keyboard focus within the container.',
  'data-binding': 'Syncs child text with container data.',
  'print-styles': 'Optimizes layout for printing.',
  'breakpoint-sync': 'Syncs layout with CSS breakpoints.',
  'container-queries': 'Stacks items below 300px container width.',
  'motion-path': 'Animates items along a curved path.',
  'ai-layout': 'Adjusts layout based on content weight.',
  'component-export': 'Exports the layout to clipboard.',
  'accessibility-boost': 'Enhances accessibility with ARIA roles.',
  'error-boundary': 'Displays errors if layout fails.',
  'perf-monitor': 'Shows render time in a corner div.',
  'state-manager': 'Saves and restores layout state.',
  'undo-redo': 'Tracks and reverts changes (Ctrl+Z/Y).',
  'voice-control': 'Changes layout via voice commands.',
  'collaborative-edit': 'Enables real-time collaborative editing.',
  'offline-cache': 'Caches content for offline use.',
  'ssr-prep': 'Generates static CSS for server-side rendering.',
  'layout-debug': 'Toggles debug outlines (Ctrl+D).'
};

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

const demoContainer = document.getElementById('demo-container');
const directionSelect = document.getElementById('direction');
const gapInput = document.getElementById('gap');
const proportionsInput = document.getElementById('proportions');
const stackInput = document.getElementById('stack');
const wrapCheckbox = document.getElementById('wrap');
const configOutput = document.getElementById('config-output');
const clearPluginsBtn = document.getElementById('clear-plugins');

function resetStyles(container) {
  container.removeAttribute('style');
  container.style.display = 'flex';
  container.style.padding = '20px';
  container.style.border = '2px dashed var(--border-color)';
  container.style.borderRadius = '12px';
  container.style.background = 'var(--card-bg)';
  container.style.boxShadow = 'var(--shadow)';
  container.style.resize = 'horizontal';
  container.style.overflow = 'auto';
  container.style.width = '100%';
  container.style.minHeight = '200px';
  container.style.maxHeight = '400px';
  Array.from(container.children).forEach(child => {
    child.removeAttribute('style');
    child.style.height = 'auto';
    child.style.padding = '20px';
    child.style.textAlign = 'center';
    child.style.borderRadius = '8px';
    child.style.transition = 'transform 0.2s ease';
    child.style.minWidth = '100px';
    child.style.background = child.textContent === 'Item 1' ? '#60a5fa' : child.textContent === 'Item 2' ? '#34d399' : '#f87171';
  });
}

function updateDemo() {
  resetStyles(demoContainer);
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

clearPluginsBtn.addEventListener('click', (e) => {
  e.preventDefault();
  setTimeout(() => window.location.replace(window.location.href), 100);
});

document.addEventListener('DOMContentLoaded', () => {
  clearPluginsBtn.addEventListener('click', (e) => {
    e.preventDefault();
    setTimeout(() => window.location.replace(window.location.href), 100);
  });
});

[directionSelect, gapInput, proportionsInput, stackInput, wrapCheckbox].forEach(el => {
  el.addEventListener('change', updateDemo);
});
pluginList.addEventListener('change', updateDemo);

updateDemo();

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

// Populate plugin checkboxes
const pluginList = document.getElementById('plugin-list');
availablePlugins.forEach(plugin => {
  const label = document.createElement('label');
  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.value = plugin;
  checkbox.id = `plugin-${plugin}`;
  label.appendChild(checkbox);
  label.append(` ${plugin}`);
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

// Update function
function updateDemo() {
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
  document.querySelectorAll('#plugin-list input:checked').forEach(checkbox => {
    checkbox.checked = false;
  });
  updateDemo();
}

// Event listeners
[directionSelect, gapInput, proportionsInput, stackInput, wrapCheckbox].forEach(el => {
  el.addEventListener('change', updateDemo);
});
pluginList.addEventListener('change', updateDemo);
clearPluginsBtn.addEventListener('click', clearPlugins);

// Initial update
updateDemo();

<template>
    <div ref="container" :data-flexor="generatedConfig" v-bind="$attrs">
      <slot></slot>
    </div>
  </template>
  
  <script>
  import { defineComponent, ref, computed, onMounted } from 'vue';
  import Flexor from './flexor.js';
  
  export default defineComponent({
    name: 'FlexorContainer',
    props: ['config'],
    setup(props) {
      const container = ref(null);
      const generatedConfig = computed(() => Flexor.generateConfig({ mode: 'flex', ...props.config }));
  
      onMounted(() => {
        if (container.value) {
          Flexor.applyTo(container.value);
        }
      });
  
      return { container, generatedConfig };
    }
  });
  </script>
  
  <!-- Usage -->
  <template>
    <flexor-container :config="{ direction: 'row', gap: '10px', smart: true }">
      <div>Item 1</div>
      <div>Item 2 with more text</div>
      <div>Item 3</div>
    </flexor-container>
  </template>
  

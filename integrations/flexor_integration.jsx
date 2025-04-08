import React, { useEffect, useRef } from 'react';
import Flexor from './flexor.js';

const FlexorContainer = ({ children, config, ...props }) => {
  const ref = useRef(null);

  useEffect(() => {
    if (ref.current) {
      const dataFlexor = Flexor.generateConfig({ mode: 'flex', ...config });
      ref.current.setAttribute('data-flexor', dataFlexor);
      Flexor.applyTo(ref.current);
    }
  }, [config]);

  return <div ref={ref} {...props}>{children}</div>;
};

// Usage
export default function App() {
  return (
    <FlexorContainer config={{ direction: 'row', gap: '10px', smart: true }}>
      <div>Item 1</div>
      <div>Item 2 with more text</div>
      <div>Item 3</div>
    </FlexorContainer>
  );
}

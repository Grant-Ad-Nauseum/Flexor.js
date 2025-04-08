Flexor.registerPlugin('voice-control', (container, config) => {
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.continuous = false;
    recognition.lang = 'en-US';
  
    recognition.onresult = (event) => {
      const command = event.results[0][0].transcript.toLowerCase();
      if (command.includes('stack now')) {
        container.style.flexDirection = 'column';
      } else if (command.includes('row now')) {
        container.style.flexDirection = 'row';
      }
      Flexor.applyTo(container);
    };
  
    const toggle = document.createElement('button');
    toggle.textContent = 'Voice Control';
    toggle.addEventListener('click', () => recognition.start());
    container.prepend(toggle);
  });
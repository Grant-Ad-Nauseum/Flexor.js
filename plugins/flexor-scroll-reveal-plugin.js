Flexor.registerPlugin('scroll-reveal', (container, config) => {
    const children = Array.from(container.children);
    children.forEach(child => {
      child.style.opacity = '0';
      child.style.transform = 'translateY(30px)';
      child.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    });
  
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
  
    children.forEach(child => observer.observe(child));
  });
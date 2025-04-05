// src/setupTests.js

// Polyfill for IntersectionObserver for testing environments
global.IntersectionObserver = class {
    constructor(callback, options) {}
    observe() {}
    unobserve() {}
    disconnect() {}
  };
  
  import '@testing-library/jest-dom';
  
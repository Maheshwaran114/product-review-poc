// src/setupTests.js

// Minimal IntersectionObserver polyfill for Jest tests
global.IntersectionObserver = class {
    constructor(callback, options) {}
    observe() {}
    unobserve() {}
    disconnect() {}
  };
  
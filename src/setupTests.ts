import '@testing-library/jest-dom';

// 可选：将 navigator.language 设为 en-US，测试中可以临时覆盖
Object.defineProperty(window.navigator, 'language', {
  value: 'en-US',
  configurable: true,
});
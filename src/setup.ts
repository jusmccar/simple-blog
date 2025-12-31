import '@testing-library/jest-dom';

if (typeof window.matchMedia !== 'function') {
  window.matchMedia = (query): MediaQueryList => {
    return {
      matches: false,
      media: query,
      onchange: null,
      addListener: (): void => {},
      removeListener: (): void => {},
      addEventListener: (): void => {},
      removeEventListener: (): void => {},
      dispatchEvent: (): boolean => false,
    };
  };
}

Object.defineProperty(window, 'getComputedStyle', {
  value: () => ({
    getPropertyValue: () => '',
  }),
});

vi.mock('@ckeditor/ckeditor5-build-classic', () => ({
  default: {},
}));

vi.mock('@ckeditor/ckeditor5-react', () => ({
  CKEditor: () => null,
}));

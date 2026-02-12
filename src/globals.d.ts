export {};

declare global {
  interface Window {
    grid: any;
    ThumbmarkJS: any;
  }

  class Muuri {
    constructor(element: Element | string, options?: any);
    refreshItems(): { layout: () => void };
    layout(): void;
  }
}

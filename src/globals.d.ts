// Type definitions for Muuri loaded via CDN
// This file extends the global window object and defines the Muuri class used in client-side scripts.

declare class Muuri {
  constructor(element: HTMLElement | string | null, options?: MuuriOptions);
  refreshItems(): Muuri;
  layout(instant?: boolean, callback?: () => void): void;
  on(event: string, handler: (...args: any[]) => void): void;
  destroy(removeElements?: boolean): void;
  getElement(): HTMLElement;
  getItems(targets?: any): any[];
}

interface MuuriOptions {
  items?: any;
  showDuration?: number;
  showEasing?: string;
  hideDuration?: number;
  hideEasing?: string;
  visibleStyles?: any;
  hiddenStyles?: any;
  layout?: {
    fillGaps?: boolean;
    horizontal?: boolean;
    alignRight?: boolean;
    alignBottom?: boolean;
    rounding?: boolean;
  };
  dragEnabled?: boolean;
  dragContainer?: HTMLElement | null;
  dragStartPredicate?: any;
  dragAxis?: 'x' | 'y' | 'xy';
  dragSort?: boolean | any;
  dragSortHeuristics?: any;
  dragSortPredicate?: any;
  dragRelease?: any;
  dragCssProps?: any;
  dragPlaceholder?: any;
  dragAutoScroll?: any;
  dragHandle?: string;
}

interface Window {
  grid: Muuri;
  ThumbmarkJS: any; // Used in fingerprinting logic
}
